import React from 'react';
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 'react-icons/fa';
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip'


function LanguagesNav({ selected, onUpdateLanguage }) {
	const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']

	return (
		<ul className='flex-center'>
			{languages.map((language) => (
				<li key={language}>
					<button
						className='btn-clear nav-link'
						style={language === selected ? { color: 'rgb(187,46,31)' } : null}
						onClick={() => onUpdateLanguage(language)}>
						{language}
					</button>

				</li>
			))}
		</ul>

	)

}

LanguagesNav.propTypes = {
	selected: PropTypes.string.isRequired,
	onUpdateLanguage: PropTypes.func.isRequired
}

function ReposGrid({ repos }) {
	return (
		<ul className='grid space-around'>
			{repos.map((repo, index) => {
				const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
				const { login, avatar_url } = owner


				return (
					<li key={html_url}>

						<Card
							header={`#${index + 1}`}
							avatar={avatar_url}
							href={html_url}
							name={login}
						>
							<ul className='card-list'>
								<li>
									<Tooltip text="Github username ">
										<FaUser color='rgb(255,191,116)' size={22} />
										<a href={`https://github.com/${login}`}>{login}</a>
									</Tooltip>
								</li>
								<li>
									<Tooltip text="Github Stars">
										<FaStar color='rgb(255,215,0)' size={22} />
										{stargazers_count.toLocaleString()} stars
                                </Tooltip>
								</li>
								<li>
									<Tooltip text="forks">
										<FaCodeBranch color='rgb(129,195,245)' size={22} />
										{forks.toLocaleString()} forks
                                </Tooltip>

								</li>
								<li>
									<Tooltip text="open">
										<FaExclamationTriangle color='rgb(241,138,147)' size={22} />
										{open_issues.toLocaleString()} open
                                </Tooltip>

								</li>
							</ul>
						</Card>


					</li>
				)
			})}
		</ul>
	)
}
ReposGrid.propTypes = {
	repos: PropTypes.array.isRequired
}

function popularReducer(state, action) {
	if (action.type === 'success') {
		return {
			...state,
			[action.selectedLanguage]: action.repos,
			error: null
		}
	} else if (action.type === 'error') {
		return {
			...state,
			error: action.error.message
		}
	} else {
		throw new Error(`That action type isn't supported.`)
	}
}

export default function Popular() {
	const [selectedLanguage, setSelectedLanguage] = React.useState('All')
	const [state, dispatch] = React.useReducer(
		popularReducer,
		{ error: null }
	)

	const fetchLanguages = React.useRef([]);

	React.useEffect(() => {

		if (fetchLanguages.current.includes(selectedLanguage) === false) {

			fetchLanguages.current.push(selectedLanguage);

			fetchPopularRepos(selectedLanguage)
				.then((repos) => dispatch({ type: 'success', selectedLanguage, repos }))
				.catch((error) => dispatch({ type: 'error', error }))

		}

	}, [fetchLanguages, selectedLanguage]);


	const isLoadng = () => !state[selectedLanguage] && state.error === null


	return (
		<React.Fragment>
			<LanguagesNav
				selected={selectedLanguage}
				onUpdateLanguage={setSelectedLanguage}
			/>

			{isLoadng() && <Loading text="Fetching Repos" />}
			{state.error && <p className='center-text error'>{state.error}</p>}
			{state[selectedLanguage] && <ReposGrid repos={state[selectedLanguage]} />}
		</React.Fragment>
	)
}
