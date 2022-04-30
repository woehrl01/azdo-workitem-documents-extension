import { Card } from 'azure-devops-ui/Card'
import { Icon } from 'azure-devops-ui/Icon'
import { Link } from 'azure-devops-ui/Link'
import styles from './style.module.scss'
import sharedStyle from '../SharedStyle'

export const Explaination = (): JSX.Element => {
    return <Card className={styles.explaination}>
        <div>
            Rules needs to be formulated in regular expression format. You can use <Link href="https://regex101.com/" target="_blank">regex101</Link> to test your regular expression.
            <p>
                Example: <code>^https:\/\/somedomain\.com/embedded</code>.
            </p>
            <p>
                <Icon iconName='Accept' className={sharedStyle.allowed} /> Allow rules will include the documents in the list if they are referenced inside the <em>Description</em> field.
            </p>
            <Icon iconName='Blocked' className={sharedStyle.blocked} /> Block rules will hide the documents from showing up in the embedded documents page. Documents are still showing up in the list. This can be useful if the document is not embeddable because of <code>X-Frame-Origin</code> contraints. <em>Blocking overrides allow.</em>
        </div>
    </Card>
}
