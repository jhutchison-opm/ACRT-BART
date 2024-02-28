import { useForm } from "react-hook-form";
import { z } from "zod";
import { resultSchema } from "#utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CollectionEntry } from "astro:content";
import { db } from "#utils/dexie/db";

const formPayloadSchema = z.object({ results: z.array(resultSchema) })
type FormData = z.infer<typeof formPayloadSchema>

export default function InputForm({ fields }: { fields: CollectionEntry<'testCases'>[] }) {

  const getDefaultValues = async () => {
    const stored = await db.testResultData.toArray()
    return fields.map(field => {
      const found = stored?.find(sr => sr.testId === field.data.id)
      return found || {
        id: undefined,
        testId: field.data.id,
        testName: '',
        testResult: '',
        testComment: ''
      }
    })
  }

  const { register, handleSubmit, getValues } = useForm<FormData>({
    mode: 'onBlur',
    resolver: zodResolver(formPayloadSchema),
    defaultValues: async () => {
      // In order to access all field values, for some reason we need to use a key within defaultValues
      return { results: await getDefaultValues() }
    },
  });

  const saveUpdate = (fieldIdx: number) => {
    const value = getValues(`results.${fieldIdx}`)
    db.testResultData.put(value, value.id)
  }

  return (
    <form onSubmit={handleSubmit(data => console.log({ data }))}>
      {/* <fieldset>
        <legend></legend>
      </fieldset>
      <fieldset>
        <legend></legend>
      </fieldset> */}

      <div className="display-flex flex-column" style={{ gap: '12px' }}>
        {fields.map((testCase, idx) => (
          <div key={idx}>
            <div className="grid-row" key={idx}>
              <div className="grid-col-5">
                <div>
                  <p className="margin-bottom2 text-secondary fw-bold fs-6 text-uppercase">Test ID</p>
                  <p><a href={testCase.data.link} target="_blank">{testCase.data.id}</a></p>
                </div>
                <div>
                  <p className="margin-bottom2 text-secondary fw-bold fs-6 text-uppercase">Test Description</p>
                  <p>{testCase.data.description}</p>
                </div>
                <div>
                  <p className="margin-bottom2 text-secondary fw-bold fs-6 text-uppercase">Expected Results</p>
                  <p>{testCase.data.expectedResult}</p>
                </div>
              </div>
              <div className="grid-col-6 grid-offset-1">
                <div className="display-flex flex-column" style={{ gap: '12px' }}>
                  <div>
                    <label className="usa-label" htmlFor={`testResult-${idx}`}>Test Result</label>
                    <input className="usa-input" id={`testResult-${idx}`} type="text" {...register(`results.${idx}.testResult` as const, {
                      required: true,
                      onBlur: () => saveUpdate(idx)
                    })} />
                  </div>
                  <div>
                    <label className="usa-label" htmlFor={`testName-${idx}`}>Test Process Name/ID</label>
                    <input className="usa-input" id={`testName-${idx}`} type="text" {...register(`results.${idx}.testName` as const, {
                      required: true,
                      onBlur: () => saveUpdate(idx)
                    })} />
                  </div>
                  <div>
                    <label className="usa-label" htmlFor={`testComment-${idx}`}>Comment</label>
                    <textarea className="usa-textarea" id={`testComment-${idx}`} rows={4} {...register(`results.${idx}.testComment` as const, {
                      required: true,
                      onBlur: () => saveUpdate(idx)
                    })} />
                  </div>
                </div>
              </div>
            </div>
            <div className="padding-top-5">
              <hr />
            </div>
          </div>
        ))}
      </div>

      <div className="margin-top-3 display-flex">
        <button className="usa-button margin-left-auto">Submit</button>
      </div>
    </form>
  )
}