#!/usr/bin/env node

/**
 * This script adds a single mock initiative to the platform for testing purposes.
 * It's a standalone script that makes direct API calls to the backend.
 */

import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const apiBasePath = process.env.NEXT_PUBLIC_API_BASE_PATH;
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "";

// Store token
let accessToken = null;

// Define endpoints
const endpoints = {
  login: "/user/login",
  user: "/user/",
  initiative: "/initiative",
  assignInitiative: "/assign-initiative",
};

// API request function
async function request(endpoint, method = "GET", data) {
  try {
    const headers = {
      "Content-Type": "application/json",
      "x-client-id": clientId,
      "x-request-id": uuidv4(),
    };
    
    // Add token if available
    if (accessToken) {
      headers["accessToken"] = accessToken;
    }
    
    const options = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }
    
    console.log(`Making ${method} request to ${apiBasePath}${endpoint}`);
    const res = await fetch(`${apiBasePath}${endpoint}`, options);
    
    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      throw new Error(`${errorData.err?.msg || JSON.stringify(errorData)}`);
    }
    
    const response = await res.json();
    
    // Save token if response contains one
    if (response.res && response.res.token) {
      accessToken = response.res.token;
      console.log("Received and stored new access token");
    }
    
    return response;
  } catch (error) {
    throw error;
  }
}

// Mock initiative with a near-future date to ensure it's visible in the platform
const mockInitiative = {
  title: "Tech Literacy Workshop Series",
  description: "Join our weekly workshop series to teach digital literacy skills to seniors in the community. Volunteers will guide participants through basic computer skills, internet safety, and using common applications. This is a great opportunity for tech-savvy individuals who enjoy teaching and have patience working with elderly learners.",
  img: "https://images.unsplash.com/photo-1594729095022-e2f6d2eece9c?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Technology education image
  timeCommitment: "2 hours per week, for a month",
  address: "Berkeley Community Center",
  volunteersNeeded: 8,
  isOnCampus: false,
  startDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
  interests: ["Digital Literacy", "Tech Education"],
  status: 0, // Open
};

async function addMockInitiative() {
  try {
    console.log("Creating mock organization if needed...");
    
    // Create or use an existing test organization
    const orgData = {
      email: "techliteracy@berkeley.edu",
      pass: "testpass123",
      name: "Berkeley Tech Literacy Program",
      userType: 1,
      bio: "We bridge the digital divide by providing technology education to underserved communities.",
      address: "Berkeley, CA",
      lat: 37.8719,
      lng: -122.2585,
      intrests: ["Technology & Innovation", "Education & Youth", "Community Development"]
    };

    let orgId;
    
    try {
      // Try logging in first
      console.log("Attempting to log in with test organization...");
      const loginResponse = await request(endpoints.login, "POST", {
        email: orgData.email,
        pass: orgData.pass
      });
      orgId = loginResponse.res._id;
      console.log("Logged in to existing organization:", orgId);
    } catch (loginErr) {
      // If login fails, create a new organization
      console.log("Login failed, creating new organization...");
      console.log("Error was:", loginErr.message);
      const org = await request(endpoints.user, "POST", orgData);
      orgId = org.res._id;
      console.log("Created new organization:", orgId);
      
      // Login after creating the organization to get a token
      console.log("Logging in with newly created organization...");
      const loginResponse = await request(endpoints.login, "POST", {
        email: orgData.email,
        pass: orgData.pass
      });
      
      // Make sure we have the correct org ID
      orgId = loginResponse.res._id;
      console.log("Successfully logged in with new organization:", orgId);
    }

    // Create initiative
    console.log("Adding mock initiative...");
    const initiativeData = {
      ...mockInitiative,
      organizationId: orgId
    };
    console.log("Initiative data:", JSON.stringify(initiativeData, null, 2));
    
    const response = await request(endpoints.initiative, "POST", initiativeData);

    console.log("Mock initiative added successfully!");
    console.log("Initiative details:", response);
    
    return response;
  } catch (error) {
    console.error("Error adding mock initiative:", error);
    throw error;
  }
}

// Execute the function
addMockInitiative()
  .then(() => console.log("Done! You can now test the initiative sign-up functionality."))
  .catch(err => console.error("Failed:", err)); 