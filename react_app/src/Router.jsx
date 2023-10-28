import {BrowserRouter, Switch, Route} from 'react-router-dom';
import index from './index'
import {Top, Page404} from './pages'

export const Router = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={index} />
                <Route exact path="/top" component={Top} />
                <Route path="*" component={Page404} />
            </Switch>
        </BrowserRouter>
    )
}
