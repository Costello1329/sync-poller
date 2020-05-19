import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import dracula from 'react-syntax-highlighter/dist/esm/styles/hljs/darcula';
import {PollQuestion, PollSolution, PollSolutionRadio} from "../../../services/poll";
import {localization} from "../../../static/Localization";
import {Checkbox} from "../../../components/userInterface/checkbox";
import {Radio} from "../../../components/userInterface/radio";
import {Guid, getRandomGuid} from "../../../utils/Guid";

import "./styles.scss";



export interface QuestionProps {
  pollQuestion: PollQuestion,
  setAnswers: (_: PollSolution) => void
}

interface QuestionState {
  pollSolution: PollSolution
}

export class Question extends React.Component<QuestionProps, QuestionState> {
  constructor (props: QuestionProps) {
    super(props);

    switch (this.props.pollQuestion.solution.type) {
      case "selectMultiple":
        this.state = {
          pollSolution: {
            type: "checkbox",
            data: this.props.pollQuestion.solution.labels.keys().map(
              (): boolean => false)
          }
        }
        break;
      case "selectOne":
        this.state = {
          pollSolution: {
            type: "radio",
            data: this.props.pollQuestion.solution.labels.keys().map(
              (): boolean => false)
          }
        }
        break;
      case "textField":
        this.state = {
          pollSolution: {
            type: "textfield",
            data: ""
          }
        }
        break;
    }

    this.props.setAnswers(this.state.pollSolution);
  }

  private getProblem (): JSX.Element {
    return (
      <div className = "pollQuestionProblem">
        {
          this.props.pollQuestion.problem.map(
            (block: PollQuestion["problem"][0]): JSX.Element => {
              if (block.type === "text")
                return (
                  <div className = "pollQuestionProblemText">
                    {block.text}
                  </div>
                );

              else if (block.type === "code")
                return (
                  <div className = "pollQuestionProblemCode">
                    <SyntaxHighlighter language = 'cpp' style = {dracula}>
                      {block.text}
                    </SyntaxHighlighter>
                  </div>
                );

              else
                return <></>;
            }
          )
        }
      </div>
    );
  }

  private getSolution (): JSX.Element {
    switch (this.props.pollQuestion.solution.type) {
      case "selectMultiple":
        return (
          <div className = "pollQuestionSolutionBlock">
            {
              (
                (): JSX.Element[] => {
                  return this.props.pollQuestion.solution.labels.keys().map(
                    (guid: string, index: number): JSX.Element => {
                      return (
                        <div
                          className ={"pollQuestionSolutionBlockCheckbox"}
                        >
                          <Checkbox
                            label = {
                              (this.props.pollQuestion.solution as
                                {type: "selectMultiple", labels: any}
                              ).labels[guid]
                            }
                            checked = {false}
                            handler = {
                              (checked: boolean): void => {
                                const solutionData: any =
                                  this.state.pollSolution.data as any;
                                solutionData[index] = checked;

                                this.setState({
                                  pollSolution: {
                                    type: "checkbox",
                                    data: solutionData
                                  }
                                });
                              }
                            }
                          />
                        </div>
                      );
                    }
                  );
                }
              )()
            }
          </div>
        );
      case "selectOne":
        return (
          <div className = "pollQuestionSolutionBlock">
            {
              (
                (): JSX.Element[] => {
                  const groupName: Guid = getRandomGuid();
                  const radioNames: Guid[] =
                    this.props.pollQuestion.solution.labels.map(
                      (): Guid => getRandomGuid()
                    );

                  return this.props.pollQuestion.solution.labels.keys().map(
                    (guid: string, index: number): JSX.Element => {
                      return (
                        <div
                          className ={"pollQuestionSolutionBlockRadio"}
                        >
                          <Radio
                            label = {
                              (this.props.pollQuestion.solution as
                                {type: "selectOne", labels: any}
                              ).labels[guid]
                            }
                            checked = {index === 0}
                            radioName = {radioNames[index].guid}
                            groupName = {groupName.guid}
                            handler = {
                              (): void => {
                                this.setState({
                                  pollSolution: {
                                    type: "radio",
                                    data: guid
                                  }
                                });
                              }
                            }
                          />
                        </div>
                      );
                    }
                  );
                }
              )()
            }
          </div>
        );
      case "textField":
        return (
          <div className = "pollQuestionSolutionBlock">
            <textarea onChange = {
              (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
                this.setState({
                  pollSolution: {
                    type: "textfield",
                    data: event.target.value
                  }
                });
              }
            }>
            </textarea>
          </div>
        );
    }
  }

  shouldComponentUpdate (
    nextProps: QuestionProps,
    nextState: QuestionState
  ): boolean {
    if (this.props !== nextProps)
      return true;

    else {
      this.props.setAnswers(nextState.pollSolution);
      return false;
    }
  }

  render (): JSX.Element {
    return (
      <div className = "pollQuestion">
        <div className = "pollQuestionProblemHeader">
          <h1>{this.props.pollQuestion.title}</h1>
        </div>
        {this.getProblem()}
        <div className = "pollQuestionSolutionHeader">
          <h2>{localization.solution()}</h2>
        </div>
        <div className = "pollQuestionSolution">
          {this.getSolution()}
        </div>
      </div>
    );
  }
}
