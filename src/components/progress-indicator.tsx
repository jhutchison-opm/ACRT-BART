import * as React from 'react'
import { db, type ResultDataType } from "#utils/dexie/db"
import { getCollection } from "astro:content";
import { useLiveQuery } from "dexie-react-hooks"
import { slug as githubSlug } from 'github-slugger'
import { getValidTestList } from '#utils/functions/get-valid-test-list';

const testList = getValidTestList()
const testCaseGroups = testList.reduce((acc, item) => {
  const key = item.baseline_name
  if (!acc[key]) {
    acc[key] = []
  }
  acc[key].push(item)
  return acc
}, {} as { [key: typeof testList[number]['baseline_name']]: typeof testList })

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

  const grouped = Object.keys(testCaseGroups).map((tcg) => {
    const slug = githubSlug(tcg)

    return {
      title: tcg,
      slug,
      tests: testCaseGroups[tcg].map(tc => ({
        id: tc.test_case_id,
        isComplete: (dataByKey[tc.test_case_id] && dataByKey[tc.test_case_id].testName && dataByKey[tc.test_case_id].testResult) ? true : false
      }))
    }
  })

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
  const completeValue = completeCount === 0 ? completeCount : (completeCount / testsCount) * 100
  const progressId = `progress-${React.useId()}`

  return (
    <div className="margin-top-2" role="progressbar" aria-labelledby={progressId} aria-valuemin={0} aria-valuemax={100} aria-valuenow={completeValue} aria-valuetext={`${completeValue}%`}>
      <div className="display-flex">
        <a href={`/test-case/${githubSlug(group.title)}`}>
          <span id={progressId}><b>{group.title}</b></span>
        </a>
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