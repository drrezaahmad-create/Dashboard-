'use client';

import React, { useState, useEffect, useCallback } from "react";
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
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalValues, setOriginalValues] = useState({}); // <-- original data

 const { data: brands } = useGetBrandsAllQuery({limit: '100'});
  const { data: category } = useGetCategroysQuery({limit: '100'});
  const { data: procedure } = useGetProcedureQuery();
  const [updateProduct] = useUpdateProductsMutation();

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
      };

      form.setFieldsValue(init);
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
   *  3. Build a **partial** FormData – only changed fields
   * ------------------------------------------------------------------ */
  const buildPartialFormData = useCallback(() => {
    const current = form.getFieldsValue(); // values from the form
    const formData = new FormData();

    let hasChanges = false;

    // ---- text / select fields -------------------------------------------------
    const fields = [
      "name",
      "description",
      "price",
      "stock",
      "brand",
      "productCode",
      "category",
      "procedure",
      "availability",
    ];

    fields.forEach((key) => {
      if (current[key] !== originalValues[key]) {
        formData.append(key, current[key]);
        hasChanges = true;
      }
    });

    // ---- images --------------------------------------------------------------
    //  • keep existing URLs (they are not changed)
    const existingUrls = fileList
      .filter((f) => f.url)
      .map((f) => f.url.replace(imageUrl, ""));

    //  • new files (they are always a change)
    const newFiles = fileList.filter((f) => f.originFileObj);

    if (existingUrls.length) {
      formData.append("images", JSON.stringify(existingUrls));
    }
    newFiles.forEach((f) => {
      formData.append("images", f.originFileObj);
      hasChanges = true;
    });

    return { formData, hasChanges };
  }, [form, originalValues, fileList]);

  /* ------------------------------------------------------------------ *
   *  4. Submit – only if something changed
   * ------------------------------------------------------------------ */
  const handleSubmit = async () => {
    try {
      await form.validateFields(); // Antd validation

      const { formData, hasChanges } = buildPartialFormData();

      

      setLoading(true);
      const res = await updateProduct({
        id: selectedProduct._id,
        data: formData,
      }).unwrap();

      message.success(res.message || "Product updated successfully!");
      setEditModal(false);
      form.resetFields();
      setFileList([]);
    } catch (err) {
      console.error(err);
      message.error(err?.data?.message || "Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------ *
   *  5. Cancel
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
          label="Description"
          name="description"
          rules={[{ required: true, message: "Enter description!" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter description" size="large" />
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