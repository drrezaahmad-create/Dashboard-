import React, { useState } from "react";
import {
  Table,
  Modal,
  Form,
  message,
  Spin,
  Pagination,
  Input,
  Button,
  Image,
  Popconfirm,
} from "antd";
import { IoEyeOutline, IoTrashOutline } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import PageHeading from "../../shared/PageHeading";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import {
  useDeleteProductsMutation,
  useGetProductsQuery,
} from "../redux/api/productManageApi";
import { imageUrl } from "../redux/api/baseApi";
import { SearchOutlined } from "@ant-design/icons";

export default function AllProducts() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // For custom delete confirmation
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [confirmInput, setConfirmInput] = useState("");

  const { data: getAllProducts, isLoading, isError } = useGetProductsQuery({
    search,
    page: currentPage,
    limit: pageSize,
  });

  const [deleteData, { isLoading: deleting }] = useDeleteProductsMutation();
  const products = getAllProducts?.data || [];

  const showAddModal = () => {
    setOpenAddModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModal(true);
  };

  // Open custom delete modal
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setConfirmInput("");
    setDeleteModalVisible(true);
  };

  // Confirm and delete
  const confirmDelete = async () => {
    if (confirmInput.toLowerCase() !== "delete") {
      message.error("Please type 'delete' to confirm");
      return;
    }

    try {
      await deleteData(productToDelete._id).unwrap();
      message.success("Product deleted successfully");
      setDeleteModalVisible(false);
      setProductToDelete(null);
    } catch (err) {
      message.error(err?.data?.message || "Failed to delete product");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" />
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-500 text-xl mt-20">
        Failed to load products!
      </div>
    );

  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "image",
      render: (images) => (
        <Image
          src={`${imageUrl}${images?.[0]}`}
          alt="product"
          width={70}
          height={70}
          className="object-cover rounded-lg border"
          fallback="https://via.placeholder.com/70"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 200,
    },
    {
      title: "Brand",
      dataIndex: ["brand", "name"],
      key: "brand",
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span className="text-lg font-bold text-green-600">
          {Number(price).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Link to={`/view-product/${record?.productId}`}>
            <Button
              icon={<IoEyeOutline className="text-blue-600" />}
              size="middle"
              className="border-blue-200 hover:border-blue-300"
            />
          </Link>

          <Button
            icon={<BiEditAlt className="text-green-600" />}
            onClick={() => handleEdit(record)}
            size="middle"
            className="border-green-200 hover:border-green-300"
          />

          {/* Custom Delete with Input Confirmation */}
          <Button
            icon={<IoTrashOutline className="text-red-600" />}
            danger
            size="middle"
            onClick={() => handleDeleteClick(record)}
            className="border-red-200 hover:border-red-300"
          />
        </div>
      ),
    },
  ];

  return (
    <main className="pb-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <PageHeading title="All Products" />

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search products..."
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: 280, height: 42 }}
            allowClear
          />

          <Button
            type="primary"
            size="large"
            onClick={showAddModal}
            className="bg-[#115E59] hover:bg-teal-700 border-none"
          >
            + Add New Product
          </Button>
        </div>
      </header>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <Table
          columns={columns}
          dataSource={products}
          rowKey="_id"
          pagination={false}
          scroll={{ x: 1000 }}
        />

        {/* Pagination */}
        <div className="p-4 border-t bg-gray-50 flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={getAllProducts?.meta?.total || 0}
            onChange={setCurrentPage}
            showSizeChanger={false}
            className="text-center"
          />
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      <Modal
        title={<span className="text-red-600 font-bold">Confirm Delete</span>}
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setDeleteModalVisible(false)}
            disabled={deleting}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            loading={deleting}
            onClick={confirmDelete}
            disabled={confirmInput.toLowerCase() !== "delete"}
          >
            Delete Product
          </Button>,
        ]}
        centered
        width={420}
      >
        <div className="py-6">
          <p className="text-gray-700 mb-4">
            This action <strong>cannot be undone</strong>. This will permanently delete the product: <span className="font-bold text-md ">
            "{productToDelete?.name}"
          </span>
          </p>
          
          <p className="text-sm text-gray-600 mb-4">
            Please type <span className="font-bold text-red-600">delete</span> to confirm:
          </p>
          <Input
            placeholder="Type 'delete' here"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            className="text-lg"
            autoFocus
          />
        </div>
      </Modal>

      {/* Other Modals */}
      <AddProduct
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
      />
      <EditProduct
        editModal={editModal}
        setEditModal={setEditModal}
        selectedProduct={selectedProduct}
      />
    </main>
  );
}