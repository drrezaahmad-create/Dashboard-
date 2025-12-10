import React, { useState } from "react";
import { Table, Modal, message, Button, Space, Popconfirm } from "antd";
import PageHeading from "../../shared/PageHeading";
import { FiPlus, FiEye, FiEdit3, FiTrash2 } from "react-icons/fi";
import Addprocedue from "./Addprocedue";
import EditProcedure from "./EditProcedure";
import {
  useDeleteProcedureMutation,
  useGetProcedureQuery,
} from "../redux/api/productManageApi";
import { imageUrl } from "../redux/api/baseApi";

const ProcedureGuide = () => {
  // ✅ Fetch all procedure data
  const { data: getAllProcedure, isLoading, isError } = useGetProcedureQuery();
  const [deleteProcedure] = useDeleteProcedureMutation();

  // ✅ Modal states
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [currentProcedure, setCurrentProcedure] = useState(null);

  // ✅ Handle actions
  const handleView = (record) => {
    setCurrentProcedure(record);
    setIsViewModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedProcedure(record);
    setEditModal(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      const res = await deleteProcedure(id).unwrap();
      message.success(res?.message);
    } catch (err) {
      message.error(err?.data?.message);
    }
  };

  if (isLoading)
    return <p className="text-center py-10">Loading procedures...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500 py-10">
        Failed to fetch procedures.
      </p>
    );

  const procedures = getAllProcedure?.data || [];

  // ✅ Table Columns
  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text) => (
        <img
          src={`${imageUrl}${text}`}
          alt="procedure"
          className="w-16 h-16 rounded-md object-cover border"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <p className="text-gray-600 truncate max-w-xs">{text}</p>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<FiEye />}
            onClick={() => handleView(record)}
          >
            View
          </Button>
          <Button
            type="default"
            icon={<FiEdit3 />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this Procedure Guide?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteClick(record?._id)}
          >
            <Button danger icon={<FiTrash2 />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <main className="pb-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-2">
        <PageHeading title="Procedure Guide" />
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => setOpenAddModal(true)}
            className="w-full md:w-auto px-6 py-3 bg-[#136BFB] rounded-lg text-white flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            <FiPlus className="w-5 h-5" />
            Add Procedure Guide
          </button>
        </div>
      </header>

      {/* ✅ Ant Design Table */}
      <Table
        columns={columns}
        dataSource={procedures}
        rowKey="_id"
        pagination={false}
      />

      {/* Add Modal */}
      <Addprocedue
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
      />

      {/* Edit Modal */}
      <EditProcedure
        editModal={editModal}
        setEditModal={setEditModal}
        selectedProcedure={selectedProcedure}
      />

      {/* View Procedure Modal */}
      <Modal
        title="Procedure Details"
        open={isViewModalVisible}
        onCancel={() => {
          setIsViewModalVisible(false);
          setCurrentProcedure(null);
        }}
        footer={null}
        centered
        width={700}
      >
        {currentProcedure && (
          <div className="space-y-6">
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img
                src={`${imageUrl}${currentProcedure.imageUrl}`}
                alt={currentProcedure.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 p-6 text-white bg-black/40 w-full">
                <h2 className="text-2xl font-bold mb-2">
                  {currentProcedure.name}
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {currentProcedure.description}
              </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button
                type="primary"
                onClick={() => {
                  setIsViewModalVisible(false);
                  setCurrentProcedure(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default ProcedureGuide;
