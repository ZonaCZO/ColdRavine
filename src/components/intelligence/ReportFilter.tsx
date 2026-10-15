type Props = {
  search: string; type: string; threat: string; date: string; types: string[];
  onSearchChange: (value: string) => void; onTypeChange: (value: string) => void;
  onThreatChange: (value: string) => void; onDateChange: (value: string) => void; onReset: () => void;
};
function ReportFilter({ search, type, threat, date, types, onSearchChange, onTypeChange, onThreatChange, onDateChange, onReset }: Props) {
  return <div className="report-filter">
    <label>Search<input type="search" value={search} onChange={e => onSearchChange(e.target.value)} placeholder="Search reports..." /></label>
    <label>Type<select value={type} onChange={e => onTypeChange(e.target.value)}><option value="">All types</option>{types.map(item => <option key={item}>{item}</option>)}</select></label>
    <label>Threat<select value={threat} onChange={e => onThreatChange(e.target.value)}><option value="">All threats</option>{["Low", "Medium", "High", "Critical"].map(item => <option key={item}>{item}</option>)}</select></label>
    <label>Date<input type="date" value={date} onChange={e => onDateChange(e.target.value)} /></label>
    <button type="button" onClick={onReset}>Reset filters</button>
  </div>;
}
export default ReportFilter;
