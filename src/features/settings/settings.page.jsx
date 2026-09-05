// FWallet Settings - OUR ELEMENTS ONLY - Navy #0d2a4a
import { useMemo, useRef, useState } from "react";
import "./settings.style.css";

const initialData = {
  fullName: "محمد أحمد",
  username: "mohammed",
  email: "mohammed@example.com",
  phone: "+967 777 000 000",
  address: "",
  gender: "",
  birthDate: "",
  nationalId: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const sections = [
  { id: "profile", label: "الملف الشخصي", icon: "user" },
  { id: "contact", label: "التواصل والعنوان", icon: "mail" },
  { id: "personal", label: "البيانات الشخصية", icon: "id" },
  { id: "security", label: "الأمان", icon: "lock" },
];

export function SettingsPage() {
  const [active, setActive] = useState("profile");
  const [form, setForm] = useState(initialData);
  const [savedForm, setSavedForm] = useState(initialData);
  const [avatar, setAvatar] = useState(null);
  const [savedAvatar, setSavedAvatar] = useState(null);
  const [toast, setToast] = useState("");
  const [showPass, setShowPass] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const fileRef = useRef(null);

  const dirty = useMemo(
    () =>
      JSON.stringify(form) !== JSON.stringify(savedForm) ||
      avatar !== savedAvatar,
    [form, savedForm, avatar, savedAvatar]
  );

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = () => {
    setSavedForm(form);
    setSavedAvatar(avatar);
    setToast("تم حفظ التغييرات");
    setTimeout(() => setToast(""), 1600);
  };

  const cancel = () => {
    setForm(savedForm);
    setAvatar(savedAvatar);
  };

  const uploadAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const current = sections.find((s) => s.id === active);

  return (
    <section className="fw-settings" dir="rtl">
      {toast && <div className="fw-toast">{toast}</div>}

      <header className="fw-settings-header">
        <div>
          <span className="fw-settings-brand">FWallet</span>
          <h1>إعدادات الحساب</h1>
          <p>إدارة معلومات حسابك وإعداداتك الشخصية.</p>
        </div>

        <div className="fw-user-summary">
          <Avatar
            avatar={avatar}
            letter={(form.fullName || "م").charAt(0)}
            small
          />
          <div>
            <strong>{form.fullName || "اسم المستخدم"}</strong>
            <span>{form.email || "البريد الإلكتروني"}</span>
          </div>
        </div>
      </header>

      <nav className="fw-settings-nav">
        {sections.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`fw-settings-nav-item ${
              active === item.id ? "active" : ""
            }`}
            onClick={() => setActive(item.id)}
          >
            <span className="fw-nav-circle">
              <Icon name={item.icon} />
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <main className="fw-settings-card">
        <div className="fw-card-head">
          <span className="fw-card-icon">
            <Icon name={current.icon} />
          </span>
          <div>
            <h2>{current.label}</h2>
            <p>{getSubtitle(active)}</p>
          </div>
        </div>

        <div className="fw-card-body">
          {active === "profile" && (
            <ProfileSection
              form={form}
              setField={setField}
              avatar={avatar}
              setAvatar={setAvatar}
              fileRef={fileRef}
              uploadAvatar={uploadAvatar}
            />
          )}

          {active === "contact" && (
            <ContactSection form={form} setField={setField} />
          )}

          {active === "personal" && (
            <PersonalSection form={form} setField={setField} />
          )}

          {active === "security" && (
            <SecuritySection
              form={form}
              setField={setField}
              showPass={showPass}
              setShowPass={setShowPass}
            />
          )}
        </div>
      </main>

      <div className="fw-settings-actions">
        <span className={dirty ? "dirty" : "clean"}>
          {dirty ? "توجد تغييرات غير محفوظة" : "كل التغييرات محفوظة"}
        </span>

        <div>
          <button
            type="button"
            className="fw-btn fw-btn-secondary"
            disabled={!dirty}
            onClick={cancel}
          >
            إلغاء
          </button>

          <button
            type="button"
            className="fw-btn fw-btn-primary"
            disabled={!dirty}
            onClick={save}
          >
            حفظ التغييرات
          </button>
        </div>
      </div>
    </section>
  );
}

export default SettingsPage;

function ProfileSection({
  form,
  setField,
  avatar,
  setAvatar,
  fileRef,
  uploadAvatar,
}) {
  return (
    <div className="fw-form-grid">
      <div className="fw-profile-box fw-span-2">
        <Avatar
          avatar={avatar}
          letter={(form.fullName || "م").charAt(0)}
        />

        <div>
          <h3>الصورة الشخصية</h3>
          <p>اختر صورة واضحة للحساب.</p>

          <div className="fw-inline-actions">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={uploadAvatar}
            />

            <button
              type="button"
              className="fw-btn fw-btn-secondary"
              onClick={() => fileRef.current?.click()}
            >
              تغيير الصورة
            </button>

            <button
              type="button"
              className="fw-text-danger"
              onClick={() => setAvatar(null)}
            >
              حذف
            </button>
          </div>
        </div>
      </div>

      <Field
        label="الاسم الكامل"
        value={form.fullName}
        onChange={(v) => setField("fullName", v)}
      />

      <Field
        label="اسم المستخدم"
        value={form.username}
        onChange={(v) => setField("username", v)}
        dir="ltr"
      />
    </div>
  );
}

function ContactSection({ form, setField }) {
  return (
    <div className="fw-form-grid">
      <Field
        label="البريد الإلكتروني"
        type="email"
        value={form.email}
        onChange={(v) => setField("email", v)}
        dir="ltr"
      />

      <Field
        label="رقم الهاتف"
        type="tel"
        value={form.phone}
        onChange={(v) => setField("phone", v)}
        dir="ltr"
      />

      <Field
        label="العنوان"
        value={form.address}
        onChange={(v) => setField("address", v)}
        full
      />
    </div>
  );
}

function PersonalSection({ form, setField }) {
  return (
    <div className="fw-form-grid">
      <div className="fw-field">
        <label>الجنس</label>
        <select
          value={form.gender}
          onChange={(e) => setField("gender", e.target.value)}
        >
          <option value="">اختر الجنس</option>
          <option value="male">ذكر</option>
          <option value="female">أنثى</option>
        </select>
      </div>

      <Field
        label="تاريخ الميلاد"
        type="date"
        value={form.birthDate}
        onChange={(v) => setField("birthDate", v)}
      />

      <Field
        label="الرقم الوطني"
        value={form.nationalId}
        onChange={(v) => setField("nationalId", v)}
        full
        dir="ltr"
      />
    </div>
  );
}

function SecuritySection({ form, setField, showPass, setShowPass }) {
  return (
    <div className="fw-form-grid">
      <PasswordField
        label="كلمة المرور الحالية"
        value={form.currentPassword}
        onChange={(v) => setField("currentPassword", v)}
        show={showPass.current}
        toggle={() =>
          setShowPass((prev) => ({
            ...prev,
            current: !prev.current,
          }))
        }
        full
      />

      <PasswordField
        label="كلمة المرور الجديدة"
        value={form.newPassword}
        onChange={(v) => setField("newPassword", v)}
        show={showPass.next}
        toggle={() =>
          setShowPass((prev) => ({
            ...prev,
            next: !prev.next,
          }))
        }
      />

      <PasswordField
        label="تأكيد كلمة المرور"
        value={form.confirmPassword}
        onChange={(v) => setField("confirmPassword", v)}
        show={showPass.confirm}
        toggle={() =>
          setShowPass((prev) => ({
            ...prev,
            confirm: !prev.confirm,
          }))
        }
      />
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  full = false,
  dir,
}) {
  return (
    <div className={`fw-field ${full ? "fw-span-2" : ""}`}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
      />
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  toggle,
  full = false,
}) {
  return (
    <div className={`fw-field ${full ? "fw-span-2" : ""}`}>
      <label>{label}</label>

      <div className="fw-password">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <button type="button" onClick={toggle}>
          <Icon name={show ? "eye-off" : "eye"} />
        </button>
      </div>
    </div>
  );
}

function Avatar({ avatar, letter, small = false }) {
  return (
    <div className={`fw-avatar ${small ? "small" : "large"}`}>
      {avatar ? (
        <img src={avatar} alt="الصورة الشخصية" />
      ) : (
        <span>{letter}</span>
      )}
    </div>
  );
}

function getSubtitle(id) {
  return {
    profile: "الصورة الشخصية والاسم واسم المستخدم.",
    contact: "البريد الإلكتروني ورقم الهاتف والعنوان.",
    personal: "الجنس وتاريخ الميلاد والرقم الوطني.",
    security: "تغيير كلمة المرور وحماية الحساب.",
  }[id];
}

function Icon({ name }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const icons = {
    user: (
      <svg {...props}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </svg>
    ),
    mail: (
      <svg {...props}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
    id: (
      <svg {...props}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8" cy="11" r="2" />
        <path d="M5.8 16c.8-1.5 2-2.2 3.2-2.2s2.4.7 3.2 2.2M14 10h4M14 14h4" />
      </svg>
    ),
    lock: (
      <svg {...props}>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    ),
    eye: (
      <svg {...props}>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
    "eye-off": (
      <svg {...props}>
        <path d="M3 3l18 18" />
        <path d="M10.7 6.2A9.2 9.2 0 0 1 12 6c6.5 0 10 6 10 6" />
        <path d="M6.7 6.7C3.7 8.5 2 12 2 12s3.5 6 10 6c1.2 0 2.3-.2 3.4-.5" />
      </svg>
    ),
  };

  return icons[name] || null;
}
