export type SurveyOption = {
  id: string | number;
  name: string;
};

export type SurveyData = {
  name: string;
  options: SurveyOption[];
  allowMultiple: boolean;
};

export type SubmitSurveyAnswer = {
  id: string | number;
};

export type SubmitSurveyRequest = {
  answers: SubmitSurveyAnswer[];
};
