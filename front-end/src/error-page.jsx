import { useRouteError } from "react-router-dom";
import { EuiCallOut, EuiLink } from '@elastic/eui';


export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">

      <EuiCallOut title="Désolé, une erreur est survenue" color="danger" iconType="alert">
        <p>
          Nous n'avons pas de solution sur le moment, cependant vous pouvez{' '}
          <EuiLink href="/">retourner sur l'accueil</EuiLink>.
        </p>
      </EuiCallOut>

    </div>
  );
}