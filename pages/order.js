import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function OrderPage() {
  const router = useRouter();
  const { companion } = router.query;
  const [requirement, setRequirement] = useState("");
  const [contact, setContact] = useState("in_app");

  const handleSubmit = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("请先登录");

    const { error } = await supabase.from("orders").insert([
      { client_id: user.id, companion_id: companion, requirement, contact_preference: contact }
    ]);

    if (error) alert(error.message);
    else {
      alert("下单成功，等待陪聊师接单");
      router.push("/");
    }
  };

  return (
    <div className="container">
      <h2>填写你的需求</h2>
      <textarea rows={4} placeholder="请简单描述你希望陪聊师了解的内容..." value={requirement} onChange={e => setRequirement(e.target.value)} />
      <select value={contact} onChange={e => setContact(e.target.value)}>
        <option value="in_app">在平台内聊天</option>
        <option value="external">留下联系方式</option>
      </select>
      <button onClick={handleSubmit}>提交订单</button>
    </div>
  );
}
