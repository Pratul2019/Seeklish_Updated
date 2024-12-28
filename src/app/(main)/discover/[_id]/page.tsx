import axios from "axios";
import { Discover } from "@/components/types";
import DiscoverModal from "@/components/Share_Models/DiscoverModal";

interface Params {
  _id: string;
}

interface ApiResponse {
  success: boolean;
  data: Discover | null;
  message?: string;
}

export default async function DiscoverPage({ params }: { params: Params }) {
  const { _id } = await params;

  try {
    const response = await axios.post<ApiResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Fetch/ShareModal/Discover`,
      { postid: _id }
    );

    if (response.data.success && response.data.data) {
      return (
        <div className="flex mt-36 justify-center h-screen w-full">
          <div className="">
            <DiscoverModal discover={response.data.data} />
          </div>
        </div>
      );
    } else {
      return <div>Discover Post not found</div>;
    }
  } catch (error) {
    console.error("Error fetching discover data:", error);
    return <div>An error occurred while fetching the discover data</div>;
  }
}
