
import RestoreUserForm from "@/Components/Authentication/RestoreUserForm";
import Link from "next/link";


export default async function RestoreUser({
  params,
}: {
  params: { username: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-header shadow-2xl rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <h2 className="text-3xl font-extrabold  text-center mb-6">
              Account Restoration
            </h2>
            <div className="space-y-4">
              <p className="text-lg  text-center">
                We are ready to restore the account. Let&apos;s proceed.
              </p>
              <RestoreUserForm username={params.username} />
            </div>
            <div className="text-xs flex flex-col items-center gap-2 mt-6">
              By continuing, you are agreeing to Terms and Conditions.{" "}
              <Link href="/Terms&Conditions">
                <div className="text-blue-500">View</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
