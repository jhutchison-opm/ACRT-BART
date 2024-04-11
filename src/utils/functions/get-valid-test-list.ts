import testList from '#data/tests.json'
import { testListSchema } from '#utils/zod'
import { z } from 'zod'

export const getValidTestList = () => {
  const schema = z.array(testListSchema)
  const result = schema.safeParse(testList.map(item => ({
    baseline_name: item.baseline_name,
    test_case_id: item.test_case_id,
    expected_result: item.expected_result,
    test_procedure: item.test_procedure
  })))

  if (!result.success) {
    throw Error(result.error.toString())
  }

  return result.data
}