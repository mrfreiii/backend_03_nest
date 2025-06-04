import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import {
  Session,
  SessionDocument,
  SessionModelType,
} from "../domain/session.entity";

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectModel(Session.name) private SessionModel: SessionModelType,
  ) {}

  async save(session: SessionDocument) {
    await session.save();
  }

  async findBy_userId_deviceId_version(dto: {
    userId: string;
    deviceId: string;
    version: number;
  }): Promise<SessionDocument | null> {
    const { userId, deviceId, version } = dto;

    return this.SessionModel.findOne({
      userId,
      deviceId,
      version,
    });
  }

  async deleteSession(dto: {
    deviceId: string;
    userId: string;
    version: number;
  }): Promise<boolean> {
    const { deviceId, userId, version } = dto;

    try {
      const result = await this.SessionModel.deleteOne({
        deviceId,
        userId,
        version,
      });
      return result.deletedCount === 1;
    } catch {
      return false;
    }
  }
}
