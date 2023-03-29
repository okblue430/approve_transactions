import { useState, useContext } from "react"
import { AppContext } from "src/utils/context"
import { InputCheckbox } from "../InputCheckbox"
import { TransactionPaneComponent } from "./types"

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
}) => {
  // fix bug7
  const { cache } = useContext(AppContext)
  const cacheKey = transaction.id
  const cacheResponse = cache?.current.get(cacheKey)
  let newApproved = transaction.approved
  if(cacheResponse) {
    newApproved = cacheResponse === "on" ? true : false
  }
  const [approved, setApproved] = useState(newApproved)

  const onClick = async () => {
    let newValue = !transaction.approved;
    await consumerSetTransactionApproval({
      transactionId: transaction.id,
      newValue,
    })

    setApproved(newValue)
  }

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={async (newValue) => {
          await consumerSetTransactionApproval({
            transactionId: transaction.id,
            newValue,
          })

          setApproved(newValue)
        }}
        onClick={onClick}
      />
    </div>
  )
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
