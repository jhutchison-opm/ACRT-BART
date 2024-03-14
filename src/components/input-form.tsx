import { useForm } from "react-hook-form";
import { z } from "zod";
import { resultSchema } from "#utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CollectionEntry } from "astro:content";
import { db } from "#utils/dexie/db";
import { expectedResultOptions } from "content/config";

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

  const resultOptions: { value: string, label: string }[] = []
  Object.entries(expectedResultOptions).forEach(([key, val]) => {
    resultOptions.push({
      value: key,
      label: val
    })
  })

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
          <div className="grid-row" key={idx}>
            <div className="grid-col-12">
              <div>
                <div className="margin-bottom-4">
                  <h2 id={testCase.data.id.replace(' ', '-')} className="margin-bottom-1 font-heading-lg">
                    <a className="text-black text-no-underline hover:text-underline" href={`#${testCase.data.id.replace(' ', '-')}`}>{testCase.data.id}</a>
                  </h2>
                  <p className="margin-top-1">
                    <a className="usa-link usa-link--external" href={testCase.data.link} target="_blank">Understanding {testCase.data.id} </a>
                  </p>
                </div>
                <dl>
                  <dt className="text-bold margin-bottom-1">Description</dt>
                  <dd className="margin-left-0">
                    <p className="margin-top-0">{testCase.data.description}</p>
                  </dd>
                  <dt className="text-bold margin-bottom-1">Expected Results</dt>
                  <dd className="margin-left-0">
                    {testCase.data.expectedResult === expectedResultOptions.pass ? (
                      <div className="display-inline-flex padding-1 bg-green text-white radius-md">
                        <svg className="usa-icon" aria-hidden="true" focusable="false" role="img">
                          <use xlinkHref="/assets/img/sprite.svg#check_circle_outline"></use>
                        </svg>
                        <span className="text-bold">{expectedResultOptions.pass}</span>
                      </div>
                    ) : testCase.data.expectedResult === expectedResultOptions.fail ? (
                      <div className="display-inline-flex padding-1 bg-secondary-darker text-white radius-md">
                        <svg className="usa-icon" aria-hidden="true" focusable="false" role="img">
                          <use xlinkHref="/assets/img/sprite.svg#highlight_off"></use>
                        </svg>
                        <span className="text-bold">{expectedResultOptions.fail}</span>
                      </div>
                    ) : testCase.data.expectedResult === expectedResultOptions.dna ? (
                      <div className="display-inline-flex padding-1 bg-base-light text-black radius-md">
                        <svg className="usa-icon" aria-hidden="true" focusable="false" role="img">
                          <use xlinkHref="/assets/img/sprite.svg#do_not_disturb"></use>
                        </svg>
                        <span className="text-bold">{expectedResultOptions.dna}</span>
                      </div>
                    ) : null}
                  </dd>
                </dl>
                <div className="display-flex flex-column" style={{ gap: '12px' }}>
                  <div>
                    <label className="usa-label" htmlFor={`testName-${idx}`}>Test Process Name/ID</label>
                    <input className="usa-input" id={`testName-${idx}`} type="text" {...register(`results.${idx}.testName` as const, {
                      required: true,
                      onBlur: () => saveUpdate(idx)
                    })} />
                  </div>
                  <div>
                    <label className="usa-label" htmlFor={`testResult-${idx}`}>Test Result</label>
                    <select className="usa-select" id={`testResult-${idx}`} {...register(`results.${idx}.testResult` as const, {
                      required: true,
                      onChange: () => saveUpdate(idx)
                    })}>
                      <option selected value="">-- Select a Result --</option>
                      {resultOptions.map((opt) => (
                        <option value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
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
            <div className="grid-col-12">
              <div className="padding-top-5">
                <hr className="border-top-1px border-solid border-base-lighter" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </form>
  )
}