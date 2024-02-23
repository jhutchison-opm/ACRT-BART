import type { processSchema, resultSchema, submitterSchema } from "#utils/zod";
import Dexie, { type Table, type WhereClause } from "dexie";
import type { z } from "zod";

type SubmitterDataType = z.infer<typeof submitterSchema>
type ProcessDataType = z.infer<typeof processSchema>
type ResultDataType = z.infer<typeof resultSchema>

export class IctTestingDB extends Dexie {
  submitterData!: Table<SubmitterDataType>
  processData!: Table<ProcessDataType>
  testResultData!: Table<ResultDataType>

  constructor() {
    super('ictTestingDB')
    this.version(1).stores({
      submitterData: '++id, agencyName',
      testResultData: '++id, testCaseId, testName, testComment'
    })
  }
}

export const db = new IctTestingDB()