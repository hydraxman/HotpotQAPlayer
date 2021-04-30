import React from 'react'

import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import ReactLoading from 'react-loading';
import _ from 'lodash';
/**
 * Palette
 * https://material-ui.com/customization/palette/
 */
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

export default class HotpotQAPlayerView extends React.Component {
    state = {
        idList: null,
        result: null,
        selectedIndex: 0,
        case: null
    }

    render() {
        const caseData = this.state.case
        if (!caseData) {
            return <center><ReactLoading color="#0f52ba" type="bubbles" height={100} width={100} /></center>
        }
        const idList = this.state.idList

        const supportingFacts = caseData.supporting_facts
        console.log(supportingFacts)
        const sTitles = {}
        supportingFacts.forEach(fact => {
            sTitles[fact[0]] = fact[1]
        })

        const supportingFactsPrediction = caseData.supporting_facts_in_prediction
        console.log(caseData)
        const sTitlesPrediction = {}
        supportingFactsPrediction.forEach(fact => {
            sTitlesPrediction[fact[0]] = fact[1]
        })

        return <table className='table table-borderless'>
            <tbody>
                <tr>
                    <td>
                        <TableContainer component={Paper} style={{ width: "280px", height: '720px' }}>
                            <Table aria-label="simple table" size="small">
                                <TableHead>
                                    <TableRow key="title-1">
                                        <StyledTableCell><b>Case ID List</b></StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {idList.map((idText, index) => <StyledTableRow key={idText} style={index == this.state.selectedIndex ? { backgroundColor: '#62FFDF' } : null} onClick={(e) => { this.clickId(e, idText, index) }}>
                                        <TableCell>{index + 1}. {idText}</TableCell>
                                    </StyledTableRow>)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </td>
                    <td>
                        <div style={{ width: '840px' }}>
                            <Paper className='p-2'>
                                <div style={{ fontSize: '1.5rem', fontFamily: '"Times New Roman", Lora, Serif' }}>
                                    <span className='badge badge-light'>Q&A</span>
                                </div>
                                <div className='p-2'>
                                    <div>
                                        <Typography variant="subtitle1" gutterBottom style={{ fontFamily: '"Times New Roman", Lora, Serif' }}>
                                            <b>{caseData.question}</b>
                                        </Typography>
                                        <Typography variant="body1" gutterBottom style={{ fontFamily: '"Times New Roman", Lora, Serif' }}>Correct answer:
                                    <span className='badge badge-info ml-2' style={{ fontFamily: '"Times New Roman", Lora, Serif' }}>
                                                {caseData.answer}
                                            </span>
                                        </Typography>
                                        <Typography variant="body1" gutterBottom style={{ fontFamily: '"Times New Roman", Lora, Serif' }}>Prediction answer:
                                    <span className='badge badge-success ml-2' style={{ fontFamily: '"Times New Roman", Lora, Serif' }}>
                                                {caseData.answer_prediction}
                                            </span>
                                        </Typography>
                                    </div>
                                    <div>
                                        <span className='badge badge-info mb-2' style={{ fontFamily: '"Times New Roman", Lora, Serif', fontSize: '0.8rem' }}>
                                            {caseData.type.toUpperCase()}
                                        </span>
                                        <span className='badge badge-warning ml-2 mb-2' style={{ fontFamily: '"Times New Roman", Lora, Serif', fontSize: '0.8rem' }}>
                                            {caseData.level.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </Paper>
                            <Paper className='p-2 mt-4'>
                                <div style={{ fontSize: '1.5rem', fontFamily: '"Times New Roman", Lora, Serif' }}>
                                    <span className='badge badge-light'>Context</span>
                                </div>
                                <div className='p-2 mt-1'>
                                    <Typography variant="subtitle1" gutterBottom style={{ fontFamily: '"Times New Roman", Lora, Serif' }}>
                                        <span>Supporting facts highlight color: </span>
                                        <span style={{ backgroundColor: '#20D18B' }}>OVERLAP</span>
                                        <span className='ml-1' style={{ backgroundColor: '#2dd' }}>GIVEN</span>
                                        <span className='ml-1' style={{ backgroundColor: '#CDEC4D' }}>PREDICTION</span>
                                        <hr />
                                    </Typography>
                                    {caseData.context.map(ct => {
                                        const title = ct[0]
                                        const contentArr = ct[1]

                                        var spIndex = -1
                                        if (_.keys(sTitles).includes(title)) {
                                            spIndex = sTitles[title]
                                        }

                                        var spIndexPrediction = -1
                                        if (_.keys(sTitlesPrediction).includes(title)) {
                                            spIndexPrediction = sTitlesPrediction[title]
                                        }

                                        return <div key={title}>
                                            <Typography variant="h6" gutterBottom style={{ fontFamily: '"Times New Roman", Lora, Serif' }}>
                                                {title}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom style={{ fontFamily: '"Times New Roman", Lora, Serif' }}>
                                                {contentArr.map((sentence, index) => {
                                                    if (index == spIndex && index == spIndexPrediction) {
                                                        return <span key={title + index} style={{ backgroundColor: '#20D18B' }}>{sentence}</span>
                                                    }
                                                    return <span key={title + index} style={index == spIndex ? { backgroundColor: '#2dd' } : index == spIndexPrediction ? { backgroundColor: '#CDEC4D' } : null}>{sentence}</span>
                                                })}
                                            </Typography>
                                        </div>
                                    }
                                    )}
                                </div>
                            </Paper>
                            <Paper className='p-3 mt-4'>
                                <Typography variant="h5" gutterBottom style={{ fontFamily: '"Times New Roman", Lora, Serif' }}>
                                    <b>Debug Info</b>
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom style={{ fontFamily: '"Times New Roman", Lora, Serif' }}>
                                    <b>Source data</b>
                                </Typography>
                                <pre>{JSON.stringify(caseData, null, 2)}</pre>
                            </Paper>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colSpan="2">{this.state.result}</td>
                </tr>
            </tbody>
        </table>
    }

    componentDidMount() {
        axios.get('/mrc/id/list').then(res => {
            if (res.data.code == 200) {
                this.setState({
                    idList: res.data.content
                })
                var firstId = res.data.content[0]
                axios.get('/mrc/obj/id/' + firstId).then(res => {
                    if (res.data.code == 200) {
                        this.setState({
                            selectedIndex: 0,
                            case: res.data.content
                        })
                    }
                }).catch(this.errorHandler)
            }
        }).catch(this.errorHandler)
    }
    clickId = (e, id, index) => {
        axios.get('/mrc/obj/id/' + id).then(res => {
            if (res.data.code == 200) {
                this.setState({
                    selectedIndex: index,
                    case: res.data.content
                })
            }
        }).catch(this.errorHandler)
    }
    errorHandler = (error) => {
        console.log(error)
        if (error.response !== undefined) {
            this.setState({
                result: <center><h5><span className="badge badge-danger">{error.response.status}: {JSON.stringify(error.response.data)}</span></h5></center>,
                updateDisabled: false,
                addDisabled: false
            })
        }
    }
}