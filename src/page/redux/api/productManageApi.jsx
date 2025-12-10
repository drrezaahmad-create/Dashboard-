import { baseApi } from "./baseApi";

const category = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategroyAll: builder.query({
      query: () => {
        return {
          url: `/categories`,
          method: "GET",
        };
      },
      providesTags: ["updateProfile"],
    }),
    getFieldCategroyAll: builder.query({
      query: ({limit}) => {
        return {
          url: `/categories?page=1&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["updateProfile"],
    }),

    getCategroys: builder.query({
      query: ({ page, limit }) => {
        return {
          url: `/categories?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["updateProfile"],
    }),

    addCategory: builder.mutation({
      query: (data) => {
        return {
          url: "/categories",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => {
        return {
          url: `/categories/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    updateCategory: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/categories/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    getBrands: builder.query({
      query: () => {
        return {
          url: `/brands`,
          method: "GET",
        };
      },
      providesTags: ["updateProfile"],
    }),

    getBrandsAll: builder.query({
      query: ({search,page,limit}) => {
        return {
          url: `/brands?search=${search}&page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["updateProfile"],
    }),

    addBrands: builder.mutation({
      query: (data) => {
        return {
          url: "/brands",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    deleteBrands: builder.mutation({
      query: (id) => {
        return {
          url: `/brands/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    updateBrands: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/brands/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    getProcedure: builder.query({
      query: () => {
        return {
          url: `/procedures`,
          method: "GET",
        };
      },
      providesTags: ["updateProfile"],
    }),

    addProcedure: builder.mutation({
      query: (data) => {
        return {
          url: "/procedures",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    deleteProcedure: builder.mutation({
      query: (id) => {
        return {
          url: `/procedures/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    updateProcedure: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/procedures/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    getProducts: builder.query({
      query: ({ page, limit, search }) => {
        return {
          url: `/products?search=${search}&page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["updateProfile"],
    }),

    getSingleProducts: builder.query({
      query: ({ id }) => {
        return {
          url: `/products/${id}`,
          method: "GET",
        };
      },
      providesTags: ["updateProfile"],
    }),
    getSingleProductsUrl: builder.query({
      query: ({ productId }) => {
        return {
          url: `/products/byid/${productId}`,
          method: "GET",
        };
      },
      providesTags: ["updateProfile"],
    }),

    addProducts: builder.mutation({
      query: (data) => {
        return {
          url: "/products",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    deleteProducts: builder.mutation({
      query: (id) => {
        return {
          url: `/products/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    updateProducts: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/products/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    getBanner: builder.query({
      query: () => {
        return {
          url: `/sliders`,
          method: "GET",
        };
      },
      providesTags: ["updateProfile"],
    }),

    addBanner: builder.mutation({
      query: (data) => {
        return {
          url: "/sliders",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    deleteBanner: builder.mutation({
      query: (id) => {
        return {
          url: `/sliders/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["updateProfile"],
    }),

    updateBanner: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/sliders/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["updateProfile"],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategroyAllQuery,
  useGetFieldCategroyAllQuery,
  useGetBrandsQuery,
  useAddBrandsMutation,
  useUpdateBrandsMutation,
  useDeleteBrandsMutation,
  useAddProcedureMutation,
  useGetProcedureQuery,
  useUpdateProcedureMutation,
  useDeleteProcedureMutation,
  useAddProductsMutation,
  useGetSingleProductsUrlQuery,
  useGetSingleProductsQuery,
  useGetProductsQuery,
  useUpdateProductsMutation,
  useDeleteProductsMutation,
  useGetCategroysQuery,
  useAddBannerMutation,
  useDeleteBannerMutation,
  useGetBannerQuery,
  useUpdateBannerMutation,
  useGetBrandsAllQuery
} = category;
