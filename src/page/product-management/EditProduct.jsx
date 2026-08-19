'use client';

import JoditEditorRaw from "jodit-react";
const JoditEditor = JoditEditorRaw?.default || JoditEditorRaw;
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  useGetBrandsAllQuery,
  useGetBrandsQuery,
  useGetCategroyAllQuery,
  useGetCategroysQuery,
  useGetProcedureQuery,
  useUpdateProductsMutation,
} from "../redux/api/productManageApi";
import { PlusOutlined } from "@ant-design/icons";
import { imageUrl } from "../redux/api/baseApi";

const { Option } = Select;

const EditProduct = ({ editModal, setEditModal, selectedProduct }) => {
  const [form] = Form.useForm();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalValues, setOriginalValues] = useState({}); // <-- original data

 const { data: brands } = useGetBrandsAllQuery({limit: '100'});
  const { data: category } = useGetCategroysQuery({limit: '100'});
  const { data: procedure } = useGetProcedureQuery();
  const [updateProduct] = useUpdateProductsMutation();

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

  /* ------------------------------------------------------------------ *
   *  1. Fill form + keep original values when modal opens
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (selectedProduct && editModal) {
      const init = {
        name: selectedProduct.name,
        productCode: selectedProduct.productCode,
        description: selectedProduct.description,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
        brand: selectedProduct?.brand?._id,
        category: selectedProduct?.category?._id,
        procedure: selectedProduct?.procedure?._id,
        availability: selectedProduct.availability,
        isPublished: selectedProduct.isPublished !== undefined ? selectedProduct.isPublished : true,
      };

      form.setFieldsValue(init);
      setContent(selectedProduct.description || "");
      setOriginalValues(init);                     // <-- keep copy
      // existing images
      if (selectedProduct.images?.length) {
        const mapped = selectedProduct.images.map((url, i) => ({
          uid: `existing-${i}`,
          name: `image-${i + 1}.png`,
          status: "done",
          url: `${imageUrl}${url}`,
        }));
        setFileList(mapped);
      }
    }
  }, [selectedProduct, editModal, form]);

  /* ------------------------------------------------------------------ *
   *  2. Upload handling (unchanged)
   * ------------------------------------------------------------------ */
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleRemove = (file) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  /* ------------------------------------------------------------------ *
   *  Submit Product Update
   * ------------------------------------------------------------------ */
  const handleSubmit = async () => {
    try {
      await form.validateFields(); // Antd validation
      const values = form.getFieldsValue();

      setLoading(true);

      const formData = new FormData();

      if (values.name) formData.append("name", values.name);
      formData.append("description", content);
      if (values.price !== undefined && values.price !== "") formData.append("price", values.price);
      if (values.stock !== undefined && values.stock !== "") formData.append("stock", values.stock);
      if (values.brand) formData.append("brand", values.brand);
      if (values.category) formData.append("category", values.category);
      if (values.procedure) formData.append("procedure", values.procedure);
      if (values.productCode) formData.append("productCode", values.productCode);
      if (values.availability) formData.append("availability", values.availability);
      formData.append("isPublished", values.isPublished !== undefined ? values.isPublished : true);

      // Existing image URLs (strings)
      const existingUrls = fileList
        .filter((f) => f.url)
        .map((f) => f.url.replace(imageUrl, ""));

      // New file objects
      const newFiles = fileList.filter((f) => f.originFileObj);

      if (existingUrls.length > 0) {
        formData.append("images", JSON.stringify(existingUrls));
      }

      newFiles.forEach((f) => {
        formData.append("images", f.originFileObj);
      });

      const res = await updateProduct({
        id: selectedProduct._id,
        data: formData,
      }).unwrap();

      message.success(res.message || "Product updated successfully!");
      setEditModal(false);
      form.resetFields();
      setFileList([]);
    } catch (err) {
      console.error("Update product error:", err);
      message.error(err?.data?.message || "Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------ *
   *  Cancel
   * ------------------------------------------------------------------ */
  const handleCancel = () => {
    setEditModal(false);
    form.resetFields();
    setFileList([]);
  };

  /* ------------------------------------------------------------------ *
   *  Render
   * ------------------------------------------------------------------ */
  return (
    <Modal
      title="Edit Product"
      open={editModal}
      onCancel={handleCancel}
      footer={null}
      width={720}
      centered
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        className="space-y-4"
      >
        {/* ---------- Photos ---------- */}
        <Form.Item label="Photos">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            onRemove={handleRemove}
            beforeUpload={() => false}
            multiple
            className="w-full"
          >
            {fileList.length >= 10 ? null : (
              <div>
                <PlusOutlined />
                <div className="mt-1">Add Image</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        {/* ---------- Form fields ---------- */}
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: "Enter product name!" }]}
        >
          <Input placeholder="Enter product name" size="large" />
        </Form.Item>

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
         
        >
          <Input placeholder="Enter product Code" size="large" />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Enter price!" }]}
        >
          <Input type="number" placeholder="Enter price" size="large" />
        </Form.Item>

        <Form.Item
          label="Stock"
          name="stock"
          rules={[{ required: true, message: "Enter stock!" }]}
        >
          <Input type="number" placeholder="Enter stock" size="large" />
        </Form.Item>

        <Form.Item
          label="Select Brand"
          name="brand"
          rules={[{ required: true, message: "Select a brand!" }]}
        >
          <Select placeholder="Select brand" size="large">
            {brands?.data?.map((b) => (
              <Option key={b._id} value={b._id}>
                {b.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Select Category"
          name="category"
          rules={[{ required: true, message: "Select a category!" }]}
        >
          <Select placeholder="Select category" size="large">
            {category?.data?.map((c) => (
              <Option key={c._id} value={c._id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Procedure Guide"
          name="procedure"
          rules={[{ required: true, message: "Select a procedure!" }]}
        >
          <Select placeholder="Select procedure" size="large">
            {procedure?.data?.map((p) => (
              <Option key={p._id} value={p._id}>
                {p.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Availability"
          name="availability"
          rules={[{ required: true, message: "Select availability!" }]}
        >
          <Select placeholder="Select availability" size="large">
            <Option value="In Stock">In Stock</Option>
            <Option value="Out of Stock">Out of Stock</Option>
            <Option value="Limited Stock">Limited Stock</Option>
            <Option value="Pre-order">Pre-order</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Publish Status (Website Visibility)"
          name="isPublished"
          rules={[{ required: true, message: "Select status!" }]}
        >
          <Select placeholder="Select visibility status" size="large">
            <Option value={true}>🌐 Public (Show on Website)</Option>
            <Option value={false}>🔒 Private / Locked (Admin Only)</Option>
          </Select>
        </Form.Item>

        {/* ---------- Submit ---------- */}
        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-11 text-base font-medium"
            style={{
              background: loading ? "#93c5fd" : "#3b82f6",
              border: "none",
            }}
          >
            {loading ? "Updating…" : "Update"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditProduct;