
import Image from 'next/image';
import React from 'react';

interface ExistLocationProps {
  data: {
    image: string;
    name: string;
    rentalName: string;
    username: string;
    _id: string;
  };
}

const ExistLocation: React.FC<ExistLocationProps> = ({ data }) => {
  if (!data) return <div>Loading...</div>;
  return (
    <div className="max-w-sm rounded-lg shadow-md p-4">
  <h2 className="text-lg font-bold mb-2">Existing Location</h2>
  <div className="flex justify-center mb-4">
    <Image
      src={data.image}
      alt=""
      height={100}
      width={100}
      className="rounded-full object-cover"
    />
  </div>
  <div className="text-sm">
    <p className="mb-1">Name: {data.rentalName}</p>
    <p className="mb-1">Managed By: {data.name} ({data.username})</p>
    {/* <p className="mb-1">ID: {data._id}</p> */}
  </div>
</div>
  );
};

export default ExistLocation;