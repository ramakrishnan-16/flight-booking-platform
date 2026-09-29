import pandas as pd


def extract_excel(file_path: str):
    sheets = pd.read_excel(
        file_path,
        sheet_name=None
    )

    content = []

    for sheet_name, dataframe in sheets.items():

        content.append(
            f"Sheet: {sheet_name}"
        )

        content.append(
            dataframe.to_csv(
                index=False
            )
        )

    return "\n".join(content)