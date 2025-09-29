import '@material-symbols/font-400';
interface IconProps {
  i: string
}

function Icon({ i }: IconProps) {
  return <span className="material-symbols-outlined">{i}</span>
}

export default Icon;
