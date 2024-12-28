"use client"

import React, { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
// import { FaShareSquare } from 'react-icons/fa';

interface ShareProps {
    postUrl: string;  
}

const Share: React.FC<ShareProps> = ({ postUrl }) => {

    useEffect(() => {
        const session = getSession();
        if (!session) {
            redirect ('/')
        }
    });
     
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    url: postUrl,
                });

            } catch (error) {
                console.error('Error sharing the post:', error);
            }
        } else {
            // Fallback for browsers that do not support the Web Share API
            navigator.clipboard.writeText(postUrl).then(() => {
                alert('Link copied to clipboard');
            }).catch((error) => {
                console.error('Error copying link to clipboard:', error);
            });
        }
    };

    return (
        <div onClick={handleShare} className='flex gap-2 '>
            {/* <FaShareSquare size={16} /> Share */}
            Share
        </div>
    );
};

export default Share;
