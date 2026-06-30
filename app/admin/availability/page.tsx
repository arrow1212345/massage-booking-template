import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const weekdays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

async function createRule(formData: FormData) {
  "use server";
  await prisma.availabilityRule.create({ data: { locationId: String(formData.get("locationId")), weekday: Number(formData.get("weekday")), startTime: String(formData.get("startTime")), endTime: String(formData.get("endTime")) } });
  revalidatePath("/admin/availability");
}

export default async function AdminAvailabilityPage() {
  const [locations, rules] = await Promise.all([prisma.location.findMany(), prisma.availabilityRule.findMany({ include: { location: true }, orderBy: [{ weekday: "asc" }, { startTime: "asc" }] })]);
  return (
    <>
      <h1>可預約時段</h1>
      <form action={createRule} className="panel form">
        <select name="locationId">{locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
        <select name="weekday" required>{weekdays.map((day, index) => <option key={day} value={index}>{day}</option>)}</select>
        <input name="startTime" type="time" required />
        <input name="endTime" type="time" required />
        <button>新增規則</button>
      </form>
      <table style={{ marginTop: 24 }}><tbody>{rules.map((r) => <tr key={r.id}><td>{r.location.name}</td><td>{weekdays[r.weekday]}</td><td>{r.startTime} - {r.endTime}</td></tr>)}</tbody></table>
    </>
  );
}
