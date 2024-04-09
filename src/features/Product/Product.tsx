"use client";

import { Input } from "@/libs/components";
import { ReactTable } from "@/libs/components/Table";
import request from "@/libs/config/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  ProductListType,
  ProductSchema,
  ProductSearchType,
  ProductType,
} from ".";
import { ButtonCreate, ButtonEdit } from "./styled";

import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Product = () => {
  const router = useRouter();

  const columnHelper = createColumnHelper<ProductType>();

  const columns = [
    columnHelper.accessor("name", {
      header: () => "Tên",
    }),
    columnHelper.accessor("price", {
      header: () => "Giá bán",
    }),
    columnHelper.accessor("cost", {
      header: () => "Giá nhập",
    }),
    columnHelper.accessor("description", {
      header: () => "Mô tả",
    }),
    columnHelper.accessor("quantity", {
      header: () => "Số lượng tồn kho",
    }),
    columnHelper.accessor("image", {
      header: () => "Hình ảnh",
      cell: (info) => (
        <img
          src={info.row.original.image}
          alt="product"
          width={50}
          height={50}
        />
      ),
    }),
    columnHelper.accessor("_id", {
      id: "action",
      header: "",
      cell: (info) => (
        <Stack direction="row" alignItems="center" spacing={3.5}>
          <ButtonEdit
            onClick={() => {
              router.push(`/product/detail/${info.getValue()}`);
            }}
          >
            <VisibilityIcon />
          </ButtonEdit>

          <ButtonEdit
            onClick={() => router.push(`/product/update/${info.getValue()}`)}
            sx={{ color: "red" }}
          >
            <EditIcon />
          </ButtonEdit>
        </Stack>
      ),
    }),
  ];

  const { control, watch } = useForm<ProductSearchType>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(ProductSchema),
  });

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      if (!watch("name")) {
        const response = await request.get<ProductListType>("/product");
        return response.data.data;
      }

      const response = await request.get<ProductListType>("/product", {
        params: {
          name: watch("name"),
        },
      });
      return response.data.data;
    },
    queryKey: ["products", watch("name")],
  });

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <ButtonCreate
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          sx={{ width: 140 }}
          onClick={() => router.push("/product/create")}
        >
          Tạo mới
        </ButtonCreate>
      </Stack>

      <Stack
        direction="row"
        justifyContent={"flex-end"}
        spacing={4}
        component="form"
        mb={4}
      >
        <Stack direction="row" spacing={2}>
          <Input
            control={control}
            name="name"
            placeholder="Tìm kiếm..."
            controlProps={{
              sx: { label: { fontWeight: 500, marginBottom: 0, fontSize: 14 } },
            }}
            sx={{
              width: 200,
              "& .MuiOutlinedInput-input": {
                fontSize: 12,
                height: 24,
              },
            }}
          />
        </Stack>
      </Stack>

      <ReactTable columns={columns} data={data || []} isLoading={isLoading} />
    </>
  );
};
export { Product };
