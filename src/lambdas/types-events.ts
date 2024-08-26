import type {SQSRecord} from 'aws-lambda';

export interface PollRecord extends Omit<SQSRecord, 'body'> {
    body: {
        clans  : string[];
        players: string[];
    };
}

export interface PollCocEvent {
    Records: PollRecord[];
}
