import axios from "axios";
import { Rental } from "@/components/types";
import RentalModal from "@/components/Share_Models/RentalModal";

interface Params {
  _id: string;
}

interface ApiResponse {
  success: boolean;
  data: Rental | null;
  message?: string;
}

export default async function RentalPage({ params }: { params: Params }) {
  const { _id } = await params;

  try {
    const response = await axios.post<ApiResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Fetch/ShareModal/Rental`,
      { postid: _id }
    );

    if (response.data.success && response.data.data) {
      return (
        <div className="flex mt-36 justify-center h-screen w-full">
          <div className="">
            <RentalModal rental={response.data.data} />
          </div>
        </div>
      );
    } else {
      return <div>Rental Post not found</div>;
    }
  } catch (error) {
    console.error("Error fetching rental data:", error);
    return <div>An error occurred while fetching the rental data</div>;
  }
}
