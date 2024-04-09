"use client";

import { Input } from "@/libs/components";
import { ReactTable } from "@/libs/components/Table";
import request from "@/libs/config/axios";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CategoryListType, CategorySearchType, CategoryType } from ".";
import { ButtonCreate, ButtonEdit } from "../Product/styled";

import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Category = () => {
  const router = useRouter();
  const columnHelper = createColumnHelper<CategoryType>();

  const columns = [
    columnHelper.accessor("name", {
      header: () => "Tên",
    }),
    columnHelper.accessor("description", {
      header: () => "Mô tả",
    }),
    columnHelper.accessor("_id", {
      id: "action",
      header: "",
      cell: (info) => (
        <Stack direction="row" alignItems="center" spacing={3.5}>
          <ButtonEdit
            onClick={() => router.push(`/category/detail/${info.getValue()}`)}
          >
            <VisibilityIcon />
          </ButtonEdit>
          <ButtonEdit
            onClick={() => router.push(`/category/update/${info.getValue()}`)}
          >
            <EditIcon />
          </ButtonEdit>
        </Stack>
      ),
    }),
  ];

  const { control, watch } = useForm<CategorySearchType>({
    defaultValues: {
      name: "",
    },
  });

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      if (!watch("name")) {
        const response = await request.get<CategoryListType>("/category");
        return response.data.data;
      }

      const response = await request.get<CategoryListType>("/category", {
        params: {
          name: watch("name"),
        },
      });
      return response.data.data;
    },
    queryKey: ["category", watch("name")],
  });

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <ButtonCreate
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          sx={{ width: 140 }}
          onClick={() => router.push("category/create")}
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
export { Category };
