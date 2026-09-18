interface SignatureExperienceBadgeProps {
  showEditorsChoice?: boolean;
  className?: string;
}

export function SignatureExperienceBadge({
  showEditorsChoice = false,
  className = "",
}: SignatureExperienceBadgeProps) {
  return (
    <span className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="badge-signature">
        <span className="badge-signature-star" aria-hidden="true">⭐</span>
        Signature Experience
      </span>
      {showEditorsChoice && (
        <span className="badge-editors-choice">
          <span aria-hidden="true">🏆</span> Editor&apos;s Choice
        </span>
      )}
    </span>
  );
}
