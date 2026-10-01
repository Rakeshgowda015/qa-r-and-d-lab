import { useMemo, useState } from 'react'
import { ExerciseCard, PageHeading, Result } from './Exercises.jsx'

const records = Array.from({ length: 47 }, (_, index) => ({
  id: `ORD-${String(2101 + index)}`,
  customer: ['Avery Morgan', 'Riley Chen', 'Sam Patel', 'Noah Williams', 'Taylor Kim', 'Jordan Lee', 'Casey Brown'][index % 7],
  product: ['Keyboard', 'Monitor', 'Mouse', 'Webcam', 'Headphones', 'Dock'][index % 6],
  category: ['Accessories', 'Displays', 'Peripherals'][index % 3],
  status: ['Processing', 'Shipped', 'Delivered'][index % 3],
  total: 18 + ((index * 37) % 280),
}))

const filterProducts = [
  { name: 'Studio Headphones', category: 'Audio', status: 'In stock', price: 89 },
  { name: 'Wireless Mouse', category: 'Accessories', status: 'In stock', price: 34 },
  { name: '4K Monitor', category: 'Displays', status: 'Low stock', price: 329 },
  { name: 'USB-C Dock', category: 'Accessories', status: 'In stock', price: 119 },
  { name: 'Desk Microphone', category: 'Audio', status: 'Low stock', price: 74 },
  { name: 'Mechanical Keyboard', category: 'Accessories', status: 'Out of stock', price: 149 },
  { name: 'Portable Display', category: 'Displays', status: 'In stock', price: 219 },
  { name: 'Webcam HD', category: 'Accessories', status: 'Out of stock', price: 59 },
]

export function PaginationSection() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(7)
  const pageCount = Math.ceil(records.length / pageSize)
  const start = (page - 1) * pageSize
  const visibleRecords = records.slice(start, start + pageSize)
  const first = records.length ? start + 1 : 0
  const last = Math.min(start + pageSize, records.length)
  const reset = () => { setPage(1); setPageSize(7) }
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <>
      <PageHeading id="pagination" objective="Navigate a stable list, change page size, and verify the visible record range and active page." />
      <ExerciseCard title="Order directory" description="A fixed set of 47 sample orders split across pages." task="Navigate to page 3, verify the first visible order, then change the page size to 10.">
        <div className="pagination-toolbar">
          <span className="small-muted">Sample order records</span>
          <label className="field page-size-field">Rows per page
            <select name="pageSize" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1) }}>
              <option value="5">5</option><option value="7">7</option><option value="10">10</option>
            </select>
          </label>
        </div>
        <div className="table-scroll"><table>
          <caption className="sr-only">Orders for practicing pagination.</caption>
          <thead><tr><th scope="col">Order ID</th><th scope="col">Customer</th><th scope="col">Product</th><th scope="col">Status</th><th scope="col">Total</th></tr></thead>
          <tbody>{visibleRecords.map((record) => <tr key={record.id} data-testid={`order-${record.id}`}><th scope="row" className="employee-id">{record.id}</th><td className="employee-name">{record.customer}</td><td>{record.product}</td><td>{record.status}</td><td>${record.total.toFixed(2)}</td></tr>)}</tbody>
        </table></div>
        <div className="pagination-footer">
          <span className="record-range" role="status">Showing <strong>{first}–{last}</strong> of <strong>{records.length}</strong> orders</span>
          <nav className="pagination-controls" aria-label="Order pages">
            <button className="page-button page-edge" type="button" disabled={page === 1} onClick={() => setPage(1)} aria-label="First page">«</button>
            <button className="page-button page-edge" type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} aria-label="Previous page">‹</button>
            {pages.map((pageNumber) => <button className={`page-button${page === pageNumber ? ' page-active' : ''}`} type="button" key={pageNumber} aria-current={page === pageNumber ? 'page' : undefined} aria-label={`Page ${pageNumber}`} onClick={() => setPage(pageNumber)}>{pageNumber}</button>)}
            <button className="page-button page-edge" type="button" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)} aria-label="Next page">›</button>
            <button className="page-button page-edge" type="button" disabled={page === pageCount} onClick={() => setPage(pageCount)} aria-label="Last page">»</button>
          </nav>
        </div>
      </ExerciseCard>
      <div className="reset-bar"><p><strong>Reset the order directory?</strong> Return to the first page with the default page size.</p><button type="button" className="button button-secondary button-small" onClick={reset}>Reset pagination</button></div>
    </>
  )
}

export function FiltersSection() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All categories')
  const [status, setStatus] = useState('Any availability')
  const [maxPrice, setMaxPrice] = useState('')
  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return filterProducts.filter((product) => {
      const matchesSearch = !normalizedSearch || product.name.toLowerCase().includes(normalizedSearch)
      const matchesCategory = category === 'All categories' || product.category === category
      const matchesStatus = status === 'Any availability' || product.status === status
      const matchesPrice = maxPrice === '' || product.price <= Number(maxPrice)
      return matchesSearch && matchesCategory && matchesStatus && matchesPrice
    })
  }, [search, category, status, maxPrice])
  const reset = () => { setSearch(''); setCategory('All categories'); setStatus('Any availability'); setMaxPrice('') }

  return (
    <>
      <PageHeading id="filters" objective="Apply multiple filters together, verify the matching results, and clear all criteria." />
      <ExerciseCard title="Product finder" description="Filters combine with AND logic. The small sample catalog stays consistent across reloads." task="Filter to Accessories that are In stock and cost at most $100, then clear all filters.">
        <div className="filter-panel">
          <label className="field filter-search">Search products<input name="productSearch" type="search" placeholder="Search product names" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <label className="field">Category<select name="productCategory" value={category} onChange={(event) => setCategory(event.target.value)}><option>All categories</option><option>Accessories</option><option>Displays</option><option>Audio</option></select></label>
          <label className="field">Availability<select name="productStatus" value={status} onChange={(event) => setStatus(event.target.value)}><option>Any availability</option><option>In stock</option><option>Low stock</option><option>Out of stock</option></select></label>
          <label className="field">Maximum price ($)<input name="maxPrice" type="number" min="0" placeholder="No maximum" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /></label>
          <button className="button button-secondary button-small clear-filters" type="button" onClick={reset}>Clear filters</button>
        </div>
        <div className="filter-summary" role="status"><strong>{filtered.length}</strong> matching {filtered.length === 1 ? 'product' : 'products'}</div>
        {filtered.length ? (
          <div className="filter-results">{filtered.map((product) => <article className="product-result" key={product.name} data-testid={`product-${product.name.toLowerCase().replaceAll(' ', '-')}`}>
            <div><h3>{product.name}</h3><span>{product.category}</span></div>
            <span className={`status-pill${product.status === 'In stock' ? '' : ' status-away'}`}><i />{product.status}</span>
            <strong className="product-price">${product.price}</strong>
          </article>)}</div>
        ) : <div className="empty-state" role="status">No products match those filters. Adjust or clear a filter to try again.</div>}
      </ExerciseCard>
    </>
  )
}

export function DateTimeSection() {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [appointment, setAppointment] = useState('')
  const [month, setMonth] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [pickerMonth, setPickerMonth] = useState(new Date(Date.UTC(2026, 9, 1)))
  const [pickerDate, setPickerDate] = useState('')
  const rangeError = startDate && endDate && endDate < startDate
  const monthLabel = pickerMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
  const firstWeekday = (pickerMonth.getUTCDay() + 6) % 7
  const daysInMonth = new Date(Date.UTC(pickerMonth.getUTCFullYear(), pickerMonth.getUTCMonth() + 1, 0)).getUTCDate()
  const calendarDays = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]
  const changeMonth = (delta) => setPickerMonth((current) => new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + delta, 1)))
  const reset = () => {
    setDate('')
    setTime('')
    setAppointment('')
    setMonth('')
    setStartDate('')
    setEndDate('')
    setPickerDate('')
    setPickerMonth(new Date(Date.UTC(2026, 9, 1)))
  }

  return (
    <>
      <PageHeading id="date-time" objective="Enter native date and time values, validate a date range, and verify the selected values." />
      <div className="exercise-grid">
        <ExerciseCard title="Custom date picker" description="A deterministic calendar starts in October 2026. Weekends and dates before October 1 are disabled." task="Choose an enabled weekday and verify its selected date. Try a disabled weekend.">
          <div className="calendar-widget" aria-label="Practice date picker">
            <div className="calendar-heading"><button className="page-button" type="button" aria-label="Previous month" onClick={() => changeMonth(-1)}>‹</button><strong>{monthLabel}</strong><button className="page-button" type="button" aria-label="Next month" onClick={() => changeMonth(1)}>›</button></div>
            <div className="calendar-grid" role="group" aria-label={monthLabel}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span className="calendar-weekday" key={day}>{day}</span>)}
              {calendarDays.map((day, index) => day === null
                ? <span className="calendar-blank" key={`blank-${index}`} />
                : (() => {
                  const dayDate = new Date(Date.UTC(pickerMonth.getUTCFullYear(), pickerMonth.getUTCMonth(), day))
                  const iso = `${dayDate.getUTCFullYear()}-${String(dayDate.getUTCMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const weekend = dayDate.getUTCDay() === 0 || dayDate.getUTCDay() === 6
                  const disabled = weekend || iso < '2026-10-01'
                  return <button className={`calendar-day${pickerDate === iso ? ' calendar-selected' : ''}`} type="button" key={iso} disabled={disabled} aria-label={dayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })} aria-pressed={pickerDate === iso} onClick={() => setPickerDate(iso)}>{day}</button>
                })())}
            </div>
            <Result label="Selected date">{pickerDate || 'No date selected'}</Result>
          </div>
        </ExerciseCard>
        <ExerciseCard title="Date and time inputs" description="Use native browser date/time controls and inspect the resulting values." task="Set a preferred date and time, then verify both formatted values.">
          <div className="field-grid">
            <label className="field">Preferred date<input name="preferredDate" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
            <label className="field">Preferred time<input name="preferredTime" type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label>
            <label className="field">Appointment date and time<input name="appointment" type="datetime-local" value={appointment} onChange={(event) => setAppointment(event.target.value)} /></label>
            <label className="field">Month<input name="reportMonth" type="month" value={month} onChange={(event) => setMonth(event.target.value)} /></label>
          </div>
          <Result>Date: {date || 'Not selected'} · Time: {time || 'Not selected'}</Result>
        </ExerciseCard>
        <ExerciseCard title="Date range" description="Choose a start and end date; the end date must not come before the start date." task="Choose a valid date range, then reverse it to trigger the range error.">
          <div className="field-grid">
            <label className="field">Start date<input name="rangeStart" type="date" value={startDate} aria-invalid={Boolean(rangeError)} onChange={(event) => setStartDate(event.target.value)} /></label>
            <label className="field">End date<input name="rangeEnd" type="date" value={endDate} aria-invalid={Boolean(rangeError)} onChange={(event) => setEndDate(event.target.value)} /></label>
          </div>
          {rangeError ? <div className="date-range-error" role="alert">End date must be the same as or later than the start date.</div>
            : <Result label="Date range">{startDate && endDate ? `${startDate} through ${endDate}` : 'Select both dates to complete the range.'}</Result>}
        </ExerciseCard>
      </div>
      <div className="reset-bar"><p><strong>Reset date and time?</strong> Clear all selected dates and times.</p><button type="button" className="button button-secondary button-small" onClick={reset}>Reset date/time</button></div>
    </>
  )
}
