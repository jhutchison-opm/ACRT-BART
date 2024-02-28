import * as React from 'react'
import { db, type ResultDataType } from "#utils/dexie/db"
import { getCollection } from "astro:content";
import { useLiveQuery } from "dexie-react-hooks"

const testCaseGroups = await getCollection("testCaseGroups");
const testCases = await getCollection("testCases");

type GroupProgressType = {
  [id: string]: ResultDataType
}

export default function ProgressIndicator() {
  const data = useLiveQuery(() => db.testResultData.toArray())
  const dataByKey: GroupProgressType = (data || []).reduce<GroupProgressType>((acc, result) => {
    acc[result.testId] = result
    return acc
  }, {})

  const grouped = testCaseGroups.map((tcg) => {
    return {
      title: tcg.data.title,
      slug: tcg.slug,
      tests: testCases.filter(tc => tc.data.group.slug === tcg.slug).map(tc => ({
        id: tc.id,
        isComplete: (dataByKey[tc.data.id] && dataByKey[tc.data.id].testName && dataByKey[tc.data.id].testResult) ? true : false
      }))
    }
  })

  console.log({ grouped })

  return (
    <div className="bg-base-lighter padding-2">
      <h3 className="margin-top-0">Your Report</h3>
      {grouped.map((group, idx) => (
        <div key={idx}>
          <GroupProgress group={group} />
        </div>
      ))}
    </div>
  )
}

type GroupType = {
  title: string
  slug: string
  tests: {
    id: string
    isComplete: boolean;
  }[]
}

const GroupProgress = ({ group }: { group: GroupType }) => {
  const testsCount = group.tests.length
  const completeCount = group.tests.filter(t => t.isComplete).length
  const completeValue = (completeCount / testsCount) * 100
  const progressId = `progress-${React.useId()}`

  return (
    <div className="margin-top-2" role="progressbar" aria-labelledby={progressId} aria-valuemin={0} aria-valuemax={100} aria-valuenow={completeValue} aria-valuetext={`${completeValue}%`}>
      <div className="display-flex">
        <div>
          <span id={progressId}><b>{group.title}</b></span>
        </div>
        <div className="margin-left-auto">
          <span>{completeCount}/{testsCount}</span>
        </div>
      </div>
      <div className="bg-white height-105 margin-top-05">
        <div className="bg-primary-dark height-105" style={{ width: `${completeValue}%` }}></div>
      </div>
    </div>
  )
}