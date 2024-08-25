import {GetParameterCommand, SSMClient} from '@aws-sdk/client-ssm';
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient} from '@aws-sdk/lib-dynamodb';

export const aws_ssm = new SSMClient({});

export const getSecret = async (key: string) => {
    const cmd = new GetParameterCommand({
        Name          : key,
        WithDecryption: true,
    });

    const resp = await aws_ssm.send(cmd);

    return resp.Parameter!.Value!;
};

export const aws_ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
