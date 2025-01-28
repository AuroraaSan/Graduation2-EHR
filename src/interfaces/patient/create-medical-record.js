import axios from 'axios';
import { auth0_audience, auth0_domain, client_id, client_secret } from '../../config/config.js';

// Function to get an access token from Auth0
async function getAccessToken() {
    try {
        const response = await axios.post(
            `https://${auth0_domain}/oauth/token`,
            {
                client_id: client_id, // Client ID of the M2M application
                client_secret: client_secret, // Client secret of the M2M application
                audience: auth0_audience, // Identifier of the patient service API
                grant_type: 'client_credentials',
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.message);
        throw error;
    }
}

// Function to create a medical record
export async function createMedicalRecord(medicalRecord) {
    try {
        // Get the access token
        const accessToken = await getAccessToken();

        // Make the request to create the medical record
        const response = await axios.post(
            // 'http://patient-records-service.default.svc.cluster.local:80/api/patient/medical-records',
            'http://localhost:3001/api/records/patient/medical-records',
            medicalRecord,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`, // Include the access token
                },
            }
        );

        if (response.status === 201) {
            console.log('Medical record created:', response.data);
            return true;
        }
    } catch (error) {
        console.error('Error creating medical record:', error.message);
        throw error;
    }
}