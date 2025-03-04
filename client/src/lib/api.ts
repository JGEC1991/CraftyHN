<file path="client/src/lib/api.ts">
      // API utility to handle both local and production environments
      const API_BASE_URL = import.meta.env.PROD
        ? '/.netlify/functions/api'
        : '/api';

      export async function fetchApi<T>(
        endpoint: string,
        options: RequestInit = {}
      ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        try {
          const response = await fetch(url, {
            headers: {
              'Content-Type': 'application/json',
              ...options.headers,
            },
            ...options,
          });

          if (!response.ok) {
            let errorBody;
            try {
              errorBody = await response.json();
            } catch (jsonError) {
              errorBody = { message: response.statusText };
            }
            throw new Error(errorBody.message || `API error: ${response.status}`);
          }

          return response.json();
        } catch (error) {
          console.error("Fetch error:", error);
          throw error;
        }
      }
    </file>
