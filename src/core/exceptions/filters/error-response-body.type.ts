import { Extension } from "../domain-exceptions";
import { DomainExceptionCode } from "../domain-exception-codes";

export type DomainErrorResponseBody = {
  errorsMessages: Extension[];
};

export type CommonErrorResponseBody = {
  timestamp: string;
  path: string | null;
  message: string;
  extensions: Extension[];
  code: DomainExceptionCode;
};
