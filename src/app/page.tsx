// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface ShuftiProResponse {
  event: string;
  verification_url?: string;
  reference: string;
}

export default function HomePage() {
  const [data, setData] = useState({ email: "", firstName: "", lastName: "" });
  const [verificationUrl, setVerificationUrl] = useState("");
  const [callbackData, setCallbackData] = useState<any>(null); // Store callback data
  const [reference, setReference] = useState<string>("");


  const clientId = "FgK49GpGTvjEkKWoqp7q8670XarUWFqtI8l7bp53g3o4B7Tny41669897952";
  const secretKey = "$2y$10$Va.Ep7XgK27hs6N2ncnDGe41Cqu7RUkxSYQHphnnDCqPLnmxYYJNO";
  const authToken = btoa(`${clientId}:${secretKey}`);


  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      console.log("event fetched",event)
      console.log("event data",data)
      if (
        data &&
        typeof data === "object" &&
        data.verification_status &&
        data.request_id
      ) {
        console.log("Callback data received:", data);
        if (data.verification_status === "verification.accepted") {
          handleStatusOfVerification();
        } else if (data.verification_status === "verification.declined") {
          alert("❌ Verification Declined.");
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [reference]);

 
  const handleStatusOfVerification = async () => {
    try {
      const payload = {
        reference: reference,
      };

      const response = await axios.post(
        "https://api.shuftipro.com/status",
        JSON.stringify(payload),
        {
          headers: {
            Authorization: "Basic " + authToken,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Shufti Pro Status Response:", response.data);
      
    } catch (error: any) {
      console.error("Shufti Status API Error:", error.response?.data || error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newReference = `digicel-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setReference(newReference);
 
    const payload = {
      "reference": newReference,
      "email": "example@example.com",
      "language": "EN",
      "redirect_url": "https://digicel.com",
      "allow_warnings":"1",
      "ttl": 60,
      "verification_mode": "any",
    
      "document": {
        "proof": "",
        "additional_proof": "",
        "supported_types": ["id_card", "driving_license", "passport"],
        "name": "",
        "dob": "",
        "age": "",
        "issue_date": "",
        "expiry_date": "",
        "document_number": "",
        "allow_offline": "1",
        "allow_online": "1",
        "gender": ""
      }
    }


    try {
      const response = await axios.post(
        "https://api.shuftipro.com/",
        JSON.stringify(payload),
        {
          headers: {
            Authorization: "Basic " + authToken,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Shufti Pro Response:", response.data);

      const { event, verification_url } = response.data as ShuftiProResponse;

      if (event === "request.pending" && verification_url) {
        setVerificationUrl(verification_url);
      } else {
        alert("Verification request was not successful.");
      }
    } catch (error: any) {
      console.error("Shufti error:", error.response?.data || error.message);
    }
  };

 

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Start Identity Verification</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Start Verification
        </button>
      </form>

      {verificationUrl && (
        <div className="mt-6">
          <p className="mb-2 text-green-700 font-medium">
            Complete your verification below:
          </p>
          <iframe
            src={verificationUrl}
            width="100%"
            height="600px"
            style={{ border: "none", backgroundColor: "#f5f5f5" }}
          ></iframe>
        </div>
      )}

      {/* Display the callback data in the UI */}
      {callbackData && (
        <div className="mt-6 p-4 border border-gray-300 rounded">
          <h2 className="font-medium">Callback Data:</h2>
          <pre>{JSON.stringify(callbackData, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
