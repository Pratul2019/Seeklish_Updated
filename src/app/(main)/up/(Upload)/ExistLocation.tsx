
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
    <div>
      <h2>Existing Location</h2>
      <Image src={data.image} alt='' height={100} width={100}/>
      <p>Rental Name: {data.rentalName}</p>
      <p>Managed By: {data.name} ({data.username})</p>
      <p>ID: {data._id}</p>
    </div>
  );
};

export default ExistLocation;