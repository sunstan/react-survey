import { AppSelectors, patchApp } from '@/store/app';
import { Button, Moon, Sun } from '@react-survey/ui';
import { useDispatch, useSelector } from '@/store';
import React from 'react';

type ThemeProps = React.ComponentPropsWithoutRef<typeof Button>;

const Theme: React.FC<ThemeProps> = (props) => {
  const dispatch = useDispatch();
  const app = useSelector(AppSelectors.state);

  React.useEffect(() => {
    document.documentElement.classList[app.dark ? 'add' : 'remove']('dark');
  }, [app.dark]);

  const toggle = () => {
    dispatch(patchApp({ dark: !app.dark }));
  };

  return (
    <Button {...props} variant="ghost" size="icon" onClick={toggle}>
      {app.dark ? <Moon /> : <Sun />}
    </Button>
  );
};

export default Theme;
