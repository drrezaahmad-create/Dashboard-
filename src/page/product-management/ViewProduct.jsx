import React, { useState } from "react";
import PageHeading from "../../shared/PageHeading";
import { useParams } from "react-router-dom";
import {
  useGetSingleProductsQuery,
  useGetSingleProductsUrlQuery,
} from "../redux/api/productManageApi";
import { imageUrl } from "../redux/api/baseApi";

const formatDescription = (desc) => {
  if (!desc) return "";
  if (!/<[a-z][\s\S]*>/i.test(desc)) {
    return desc
      .split(/\r?\n\r?\n/)
      .map((para) => `<p class="mb-3">${para.replace(/\r?\n/g, '<br />')}</p>`)
      .join("");
  }
  return desc;
};

export default function ViewProduct() {
  const { id } = useParams();
  const productId = id;
  const { data: singleProduct, isLoading } = useGetSingleProductsUrlQuery({
    productId,
  });
  const [selectedImage, setSelectedImage] = useState(0);
  console.log(singleProduct);
  if (isLoading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  // If no product found
  if (!singleProduct) {
    return <p className="text-center text-red-500">Product not found!</p>;
  }

  const product = singleProduct?.data; // shorthand
  const productImages = product?.images || [];

  return (
    <div className="w-full pb-10">
      <div className="flex justify-between items-start md:items-center mb-5 gap-5">
        <PageHeading title="Product Details" />
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="w-full space-y-5">
          <div
            className="w-full bg-gray-100 rounded-xl overflow-hidden group"
            style={{ maxHeight: "600px" }}
          >
            <img
              src={`${imageUrl}${productImages[selectedImage]}`}
              alt={product?.name}
              className="w-full h-[500px] md:h-[600px] mx-auto object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="w-full flex gap-3 overflow-x-auto pb-2">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedImage === index
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={`${imageUrl}${image}`}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="w-full space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {product?.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#9F9C96]">Availability:</span>
            <span className="text-[#136BFB] font-semibold">
              {product?.availability}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#9F9C96]">Product Code:</span>
            <span className="text-[#136BFB] font-semibold">
              {product?.productCode}
            </span>
          </div>
          <div className="space-y-2">
            <div
              className="text-[#9F9C96] leading-relaxed [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_p]:mb-2"
              dangerouslySetInnerHTML={{ __html: formatDescription(product?.description) }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[#9F9C96]">Brand:</span>
              <span className="text-[#136BFB] font-semibold">
                {product?.brand?.name || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#9F9C96]">Category:</span>
              <span className="text-[#136BFB] font-semibold">
                {product?.category?.name || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#9F9C96]">Procedure:</span>
              <span className="text-[#136BFB] font-semibold">
                {product?.procedure?.name || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#9F9C96]">Stock Amount:</span>
              <span className="text-[#136BFB] font-semibold">
                {product?.stock}
              </span>
            </div>
          </div>

          <div className="py-4">
            <p className="text-4xl font-bold text-[#136BFB]">
              ${product?.price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
