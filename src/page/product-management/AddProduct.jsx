import JoditEditorRaw from "jodit-react";
const JoditEditor = JoditEditorRaw?.default || JoditEditorRaw;
import { v4 as uuidv4 } from "uuid";
import React, { useState, useRef } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Spin,
} from "antd";
import {
  useAddProductsMutation,
  useGetBrandsAllQuery,
  useGetBrandsQuery,
  useGetCategroyAllQuery,
  useGetCategroysQuery,
  useGetFieldCategroyAllQuery,
  useGetProcedureQuery,
} from "../redux/api/productManageApi";

const { Option } = Select;

const onPreview = async (file) => {
  let src = file.url;
  if (!src) {
    src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => resolve(reader.result);
    });
  }
  const image = new Image();
  image.src = src;
  const imgWindow = window.open(src);
  imgWindow?.document.write(image.outerHTML);
};

const AddProduct = ({ openAddModal, setOpenAddModal }) => {
  const [form] = Form.useForm();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: brands } = useGetBrandsAllQuery({ limit: '100' });
  const { data: category } = useGetCategroysQuery({ limit: '100' });
  const { data: procedure } = useGetProcedureQuery();

  const [addProduct] = useAddProductsMutation();

  const editorConfig = React.useMemo(() => ({
    readonly: false,
    placeholder: "Start typing product description...",
    height: 300,
    toolbarSticky: false,
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "ul",
      "ol",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "link",
      "fullsize"
    ],
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
  }), []);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // ✅ Submit Form
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // Append images as an array using `image[]`
      fileList.forEach((file) => {
        formData.append("images", file.originFileObj);
      });
      // ✅ Generate unique productId
      const productId = uuidv4();

      // Append productId to formData
      formData.append("productId", productId);
      // Other fields

      formData.append("name", values.name);
      formData.append("description", content);
      formData.append("isPublished", values.isPublished !== undefined ? values.isPublished : true);
      formData.append("price", values.price);
      formData.append("stock", values.stock);
      formData.append("brand", values.brand);
      formData.append("category", values.category);
      if (values.procedure) {
        formData.append("procedure", values.procedure);
      }
      formData.append("productCode", values.productCode);
      formData.append("availability", values.availability);
      formData.append(
        "productUrl",
        `http://13.134.227.59/product/${productId}`
      );
      const res = await addProduct(formData).unwrap();
      message.success(res.message || "Product added successfully!");
      setOpenAddModal(false);
      form.resetFields();
      setContent("");
      setFileList([]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      message.error(error?.data?.message || "Failed to add product");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpenAddModal(false);
    form.resetFields();
    setContent("");
    setFileList([]);
  };

  return (
    <Modal
      title="Add New Product"
      open={openAddModal}
      onCancel={handleCancel}
      footer={null}
      width={700}
      centered
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        className="p-2 space-y-4"
      >
        {/* Images */}
        <Form.Item label="Photos">
          <Upload
            style={{ width: "100%", height: "160px" }}
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
            multiple
          >
            {fileList.length < 5 && "+ Upload"}
          </Upload>
        </Form.Item>

        {/* Product Name */}
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: "Please enter product name!" }]}
        >
          <Input
            style={{ height: "45px", borderRadius: "8px" }}
            placeholder="Enter product name"
            size="large"
          />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description (Rich Text)"
        >
          <JoditEditor
            ref={editor}
            value={content}
            config={editorConfig}
            tabIndex={1}
            onBlur={(newContent) => setContent(newContent)}
            onChange={(newContent) => setContent(newContent)}
          />
        </Form.Item>

        <Form.Item
          label="Product Code"
          name="productCode"
          rules={[{ required: true, message: "Please enter product Code" }]}
        >
          <Input
            style={{ height: "45px", borderRadius: "8px" }}
            placeholder="Enter product Code"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter price!" }]}
        >
          <Input
            style={{ height: "45px", borderRadius: "8px" }}
            type="number"
            placeholder="Enter price"
            size="large"
          />
        </Form.Item>

        {/* Stock */}
        <Form.Item
          label="Stock"
          name="stock"
          rules={[{ required: true, message: "Please enter stock!" }]}
        >
          <Input
            style={{ height: "45px", borderRadius: "8px" }}
            type="number"
            placeholder="Enter stock"
            size="large"
          />
        </Form.Item>

        {/* Brand */}
        <Form.Item
          label="Select Brand"
          name="brand"
          rules={[{ required: true, message: "Please select a brand!" }]}
        >
          <Select
            style={{ height: "44px" }}
            placeholder="Select brand"
            size="large"
          >
            {brands?.data?.map((b) => (
              <Option key={b._id} value={b._id}>
                {b.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Category */}
        <Form.Item
          label="Select Category"
          name="category"
          rules={[{ required: true, message: "Please select a category!" }]}
        >
          <Select
            style={{ height: "44px" }}
            placeholder="Select category"
            size="large"
          >
            {category?.data?.map((c) => (
              <Option key={c._id} value={c._id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Procedure */}
        <Form.Item
          label="Procedure Guide"
          name="procedure"

        >
          <Select
            style={{ height: "44px" }}
            placeholder="Select procedure"
            size="large"
          >
            {procedure?.data?.map((p) => (
              <Option key={p._id} value={p._id}>
                {p.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Availability */}
        <Form.Item
          label="Availability"
          name="availability"
          rules={[{ required: true, message: "Please select availability!" }]}
        >
          <Select
            style={{ height: "44px" }}
            placeholder="Select availability"
            size="large"
          >
            <Option value="In Stock">In Stock</Option>
            <Option value="Out of Stock">Out of Stock</Option>
            <Option value="Limited Stock">Limited Stock</Option>
            <Option value="Pre-order">Pre-order</Option>
          </Select>
        </Form.Item>

        {/* Publish Status */}
        <Form.Item
          label="Publish Status (Website Visibility)"
          name="isPublished"
          initialValue={true}
          rules={[{ required: true, message: "Please select publish status!" }]}
        >
          <Select
            style={{ height: "44px" }}
            placeholder="Select status"
            size="large"
          >
            <Option value={true}>🌐 Public (Show on Website)</Option>
            <Option value={false}>🔒 Private / Locked (Admin Only)</Option>
          </Select>
        </Form.Item>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            className={`w-full py-3 rounded text-white flex justify-center items-center gap-2 transition-all duration-300 ${loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-[#3b82f6] hover:bg-blue-500"
              }`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spin size="small" />
                <span>Submitting...</span>
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddProduct;
