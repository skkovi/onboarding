"use client";
import { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";

export default function Data({ data }) {
  const supabase = createClient();
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, email, aboutMe, street, city, state, zip, birthDate");
      console.log("Fetched data:", data);
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setUserData(data || []);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">About Me</th>
            <th className="px-4 py-2 border">Address</th>
            <th className="px-4 py-2 border">Birthdate</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {userData.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No user data available
              </td>
            </tr>
          ) : (
            userData.map((user) => (
              <tr key={user.id} className="text-gray-700">
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.aboutMe}</td>
                <td className="px-4 py-2 border">{`${user.street}, ${user.city}, ${user.state}, ${user.zip}`}</td>
                <td className="px-4 py-2 border">{user.birthDate}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
