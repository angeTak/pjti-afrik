import separatorPattern from '@/assets/separator-pattern.png';

interface SeparatorPatternProps {
  className?: string;
}

const SeparatorPattern = ({ className = '' }: SeparatorPatternProps) => (
  <div className={`w-full overflow-hidden leading-none ${className}`}>
    <img
      src={separatorPattern}
      alt=""
      className="w-full h-auto block"
      style={{ display: 'block', marginBottom: '-2px' }}
    />
  </div>
);

export default SeparatorPattern;
