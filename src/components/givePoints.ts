import api from "@/pages/api/axi";

export default async function givePoints() {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error('Token not found');
        }

        // Get the uuid from the user data
        const userResponse = await api.get('/auth/user', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (userResponse.status !== 200) {
            throw new Error('Failed to fetch user data');
        }

        const uuid = userResponse.data.uuid;

        // Make a POST request to give points using the retrieved uuid
        const pointsResponse = await api.post(`/user/points/${uuid}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (pointsResponse.status !== 200) {
            throw new Error('Failed to give points');
        }

        return pointsResponse.data;
    } catch (error) {
        console.error('Error in givePoints function:', error);
        throw error;
    }
}
