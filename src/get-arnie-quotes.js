const { httpGet } = require('./mock-http-interface');

/**
 * Constants
 */
const SUCCESSFUL_RESULT_KEY = "Arnie Quote";
const UNSUCCESSFUL_RESULT_KEY = "FAILURE";

/**
 * Factory for creating successful Arnie Quote results from a parsed HTTP body
 * @param {Object} body JSON parsed body from a HTTP request
 * @returns {{ "Arnie Quote": string }}
 */
const createSuccessfulResult = (body) => {
  // Good use case for use optional chaining and nullish coalescing here from node 14+
  const message = body && body.message || '';
  return {
    [SUCCESSFUL_RESULT_KEY]: message
  };
}

/**
 * Factory for creating failed Arnie Quote results from a parsed HTTP body
 * @param {Object} body JSON parsed body from a HTTP request
 * @returns {{ "FAILURE": string }}
 */
 const createFailedResult = (body) => {
   // Good use case for use optional chaining and nullish coalescing here from node 14+
   const message = body && body.message || '';
  return {
    [UNSUCCESSFUL_RESULT_KEY]: message
  };
}

/**
 * Validates whether a HTTP response can have its body field parsed
 * @param {Object} response HTTP response to check the parseability of its body
 * @returns {boolean}
 */
const isResponseBodyParseable = (response) => {
  return response && response.body && typeof response.body === 'string';
}

/**
 * Performs a HTTP GET call against all passed in urls. 
 * Assumes urls do not need to be input checked.
 * @param {string[]} urls 
 * @returns {Promise<({ "Arnie Quote": string } | { "FAILURE": string })[]>}
 */
const getArnieQuotes = async (urls) => {
  const quoteRequests = urls.map(async (url) => {
    try {
      const response = await httpGet(url);

      if (!isResponseBodyParseable(response)) {
        throw new Error('Malformed body in response');
      }

      if (response.status !== 200) {
        return createFailedResult(JSON.parse(response.body));
      }

      return createSuccessfulResult(JSON.parse(response.body));
    } catch (error) {
      // Unsure if this case is expected but we can treat it like a failed case
      if (error instanceof Error) {
        return createFailedResult(error);
      }

      return createFailedResult({ message: 'Unhandled error' });
    }
  });

  return Promise.all(quoteRequests);
};

module.exports = {
  getArnieQuotes,
};
