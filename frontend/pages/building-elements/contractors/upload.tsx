import { ContractorCreateForm } from "@/components/forms/ContractorForm";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";

const ContractorUploadPage = () => {
  const router = useRouter();
  return (
    <>
      <h2>Create Contractor</h2>
      <ContractorCreateForm
        onSuccess={() => {
          toast.success("Contractor created");
          router.push("/building-elements/contractors");
        }}
      />
    </>
  );
};

export default ContractorUploadPage;
