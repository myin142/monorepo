import { Request, AWSError, Response } from 'aws-sdk';
import { mock } from 'jest-mock-extended';

export const mockAWSResponsePromise = <T>(value: T): Request<T, AWSError> => {
    const response = mock<Request<T, AWSError>>();

    response.promise.mockResolvedValueOnce({
        ...value,
        $response: mock<Response<T, AWSError>>(),
    });

    return response;
};
