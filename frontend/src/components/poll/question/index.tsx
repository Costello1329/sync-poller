import React, { ChangeEvent } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import dracula from 'react-syntax-highlighter/dist/esm/styles/hljs/darcula';
import {PollQuestion, PollSolution} from "../../../services/poll";
import {localization} from "../../../static/Localization";
import {Checkbox} from "../../../components/userInterface/checkbox";
import {Radio} from "../../../components/userInterface/radio";
import {Guid, getRandomGuid} from "../../../utils/Guid";

import "./styles.scss";



export class Question extends React.Component<PollQuestion> {
  declare private readonly pollSolution: PollSolution

  constructor (props: PollQuestion) {
    super(props);

    switch (this.props.solution.type) {
      case "selectMultiple":
        this.pollSolution = {
          type: "checkbox",
          data: this.props.solution.labels.map((_: string): boolean => false)
        }
        break;
      case "selectOne":
        this.pollSolution = {
          type: "radio",
          data: null
        }
        break;
      case "textField":
        this.pollSolution = {
          type: "textfield",
          data: ""
        }
        break;
    }
  }

  private getProblem (): JSX.Element {
    return (
      <div className = "pollQuestionProblem">
        {
          this.props.problem.map(
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
    switch (this.props.solution.type) {
      case "selectMultiple":
        return (
          <div className = "pollQuestionSolutionBlock">
            {
              (
                (): JSX.Element[] => {
                  return this.props.solution.labels.map(
                    (label: string, index: number): JSX.Element => {
                      return (
                        <div
                          className ={"pollQuestionSolutionBlockCheckbox"}
                        >
                          <Checkbox
                            label = {label}
                            checked = {false}
                            handler = {
                              (checked: boolean): void => {
                                (this.pollSolution.data as boolean[])[index] =
                                  checked;
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
                    this.props.solution.labels.map((): Guid => getRandomGuid());

                  return this.props.solution.labels.map(
                    (label: string, index: number): JSX.Element => {
                      return (
                        <div
                          className ={"pollQuestionSolutionBlockRadio"}
                        >
                          <Radio
                            label = {label}
                            checked = {index === 0}
                            radioName = {radioNames[index].guid}
                            groupName = {groupName.guid}
                            handler = {
                              (): void => {
                                this.pollSolution.data = index;
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
                this.pollSolution.data = event.target.value;
              }
            }>
            </textarea>
          </div>
        );
    }
  }

  componentDidMount (): void {
    /// setTimeout(() => alert(JSON.stringify(this.pollSolution)), 1000);
  }

  render (): JSX.Element {
    return (
      <div className = "pollQuestion">
        <div className = "pollQuestionProblemHeader">
          <h1>{this.props.title}</h1>
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
