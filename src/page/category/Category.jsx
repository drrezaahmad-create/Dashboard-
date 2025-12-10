import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Modal,
  message,
  Button,
  Upload,
  Spin,
  Pagination,
  Popconfirm,
} from "antd";
import { FiEdit3, FiTrash2, FiPlus } from "react-icons/fi";
import PageHeading from "../../shared/PageHeading";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategroyAllQuery,
  useGetCategroysQuery,
  useUpdateCategoryMutation,
} from "../redux/api/productManageApi";
import { imageUrl } from "../redux/api/baseApi";

export default function Category() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const handlePageChange = (page) => setCurrentPage(page);
  const { data: getAllCategory, refetch } = useGetCategroysQuery({
    page: currentPage,
    limit: pageSize,
  });
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  console.log(currentCategory);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const onChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const onPreview = async (file) => {
    let src =
      file.url ||
      (await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      }));
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  useEffect(() => {
    if (currentCategory) {
      editForm.setFieldsValue({
        name: currentCategory.name,
      });
      setFileList([
        {
          uid: "-1",
          name: "category-image.png",
          status: "done",
          url: `${imageUrl}${currentCategory.imageUrl}`,
        },
      ]);
    }
  }, [currentCategory, editForm]);

  const handleAddCategory = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      fileList.forEach((file) => formData.append("image", file.originFileObj));
      formData.append("name", values.name);

      const res = await addCategory(formData).unwrap();
      message.success(res.message || "Category added successfully");
      setLoading(false);
      setIsAddModalVisible(false);
      setFileList([]);
      addForm.resetFields();
      refetch();
    } catch (err) {
      console.error(err);
      setLoading(false);
      message.error(err?.data?.message || "Failed to add category");
    }
  };

  const handleEditCategory = async (values) => {
    try {
      const formData = new FormData();
      fileList.forEach((file) => formData.append("image", file.originFileObj));
      formData.append("name", values.name);
      setLoading(true);
      const res = await updateCategory({
        id: currentCategory._id,
        data: formData,
      }).unwrap();
      message.success(res.message || "Category updated successfully");
      setIsEditModalVisible(false);
      setLoading(false);
      setFileList([]);
      editForm.resetFields();
      setCurrentCategory(null);
      refetch();
    } catch (err) {
      console.error(err);
      setLoading(false);
      message.error(err?.data?.message || "Failed to update category");
    }
  };

  // Delete Category
  const handleDelete = async (category) => {
    try {
      const res = await deleteCategory(category._id).unwrap();
      message.success(res.message || "Category deleted successfully");
      refetch();
    } catch (err) {
      console.error(err);
      message.error(err?.data?.message || "Failed to delete category");
    }
  };

  const openEditModal = (category) => {
    setCurrentCategory(category);
    setFileList([]); // reset file list
    setIsEditModalVisible(true);
  };

  return (
    <main className="pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-5">
        <PageHeading title="All Category" />
        <button
          onClick={() => setIsAddModalVisible(true)}
          className="w-full md:w-[200px] p-[10px] bg-[#136BFB] rounded text-white flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Add Category
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-5 md:px-0">
        {getAllCategory?.data?.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group"
          >
            <div className="relative overflow-hidden rounded-t-xl">
              <img
                src={`${imageUrl}${item.imageUrl}`}
                alt={item.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <p className="text-lg font-bold text-gray-700">{item.name}</p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <FiEdit3 className="h-4 w-4" />
                </button>
                     <Popconfirm
            title="Are you sure to delete this brand?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(item)}
          >
                <button
                  
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button></Popconfirm>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center ">
        <div className="bg-white px-2 py-1 rounded-md shadow-md">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={getAllCategory?.meta?.total || 0}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
      {/* Add Modal */}
      <Modal
        title="Add Category"
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          setFileList([]);
          addForm.resetFields();
        }}
        footer={null}
        centered
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddCategory}>
          <Form.Item
            style={{ height: "45px", borderRadius: "8px" }}
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Enter category name" }]}
          >
            <Input
              style={{ height: "45px", borderRadius: "8px" }}
              placeholder="Category Name"
            />
          </Form.Item>
          <div className="mt-11">
            <Form.Item label="Image">
              <Upload
                style={{ width: "100%", height: "160px" }}
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
              >
                {fileList.length < 1 && "+ Upload"}
              </Upload>
            </Form.Item>
          </div>

          <Form.Item>
            <div className="flex justify-end">
              <button
                className={`w-full py-3 rounded text-white flex justify-center items-center gap-2 transition-all duration-300 ${
                  loading
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
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Category"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setFileList([]);
          setCurrentCategory(null);
          editForm.resetFields();
        }}
        footer={null}
        centered
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditCategory}>
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Enter category name" }]}
          >
            <Input
              style={{ height: "45px", borderRadius: "8px" }}
              placeholder="Category Name"
            />
          </Form.Item>
          <div className="">
            <Form.Item label="Image">
              <Upload
                style={{ width: "100%", height: "160px" }}
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
              >
                {fileList.length < 1 && "+ Upload"}
              </Upload>
            </Form.Item>
          </div>

          <Form.Item>
            <div className="flex justify-end">
              <button
                className={`w-full py-3 rounded text-white flex justify-center items-center gap-2 transition-all duration-300 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-[#3b82f6] hover:bg-blue-500"
                }`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spin size="small" />
                    <span>Updating...</span>
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
