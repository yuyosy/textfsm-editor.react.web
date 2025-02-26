import json
import re
from pathlib import Path

import ntc_templates
from pydantic import BaseModel


class TemplateInfo(BaseModel):
    template: str
    hostname: str
    platform: str
    command_raw: str
    command_regex: str


class TemplateIndex(BaseModel):
    version: str
    template_list: list[TemplateInfo]


def convert_command_regex(command_raw: str) -> str:
    """
    Convert [[...]] to (...)?
    """

    def convert_bracket(match):
        chars = match.group(1)
        result = chars[-1]
        for char in reversed(chars[:-1]):
            result = f"{char}({result})?"
        return f"({result})?"

    return re.sub(r"\[\[([^\]]+)\]\]", convert_bracket, command_raw)


def split_platform(platform: str) -> list[str]:
    """
    Split platform string if it contains (A|B) pattern.
    """

    if "(" not in platform:
        return [platform]

    pattern = r"\(([^)]+)\)"
    current_pos = 0
    prefix = ""
    alternatives_list = []

    for match in re.finditer(pattern, platform):
        prefix += platform[current_pos : match.start()]
        alternatives = [alt.strip() for alt in match.group(1).split("|")]
        alternatives_list.append(alternatives)
        current_pos = match.end()

    suffix = platform[current_pos:]

    if not alternatives_list:
        return [platform]

    results = [prefix + alt for alt in alternatives_list[0]]

    for alternatives in alternatives_list[1:]:
        new_results = []
        for result in results:
            for alt in alternatives:
                new_results.append(result + alt)
        results = new_results

    if suffix:
        results = [result + suffix for result in results]

    return results


def parse_template_name(template_name: str) -> list[str]:
    """
    If template name contains ':' character, it will be split into multiple templates.
    """
    return template_name.split(":") if ":" in template_name else [template_name]


def convert_csv_to_template_info_list(
    buf: str, header: bool = True, separator: str = ", "
) -> TemplateIndex:
    """
    Convert a CSV string to a list of TemplateInfo objects.
    CSV format:
        Template, Hostname, Platform, Command
    """
    csv_dict_list: list[TemplateInfo] = []
    header_keys: list[str] = []
    for line in buf.splitlines():
        if line.startswith("#"):
            continue
        line = line.strip()
        if not line:
            continue
        if header and not header_keys:
            header_keys = [entry.strip().lower() for entry in line.split(separator)]
        else:
            template_names = parse_template_name(line.split(separator)[0])
            hostname = line.split(separator)[1]
            platforms = split_platform(line.split(separator)[2])
            command_raw = line.split(separator)[3]
            command_regex = convert_command_regex(command_raw)
            for template in template_names:
                for platform in platforms:
                    csv_dict_list.append(
                        TemplateInfo(
                            template=template,
                            hostname=hostname,
                            platform=platform,
                            command_raw=command_raw,
                            command_regex=command_regex,
                        )
                    )

    return TemplateIndex(version=ntc_templates.__version__, template_list=csv_dict_list)


if __name__ == "__main__":
    # run `uv run scripts/generate_ntc_template_info.py`

    ntc_templates_path = Path(ntc_templates.__file__).parent
    template_index_path = ntc_templates_path.joinpath("templates/index")

    with template_index_path.open("r", encoding="utf-8") as f:
        ntc_templates_info = convert_csv_to_template_info_list(f.read())

    with (
        Path.cwd()
        .joinpath("public/ntc-templates-info.json")
        .open("w", encoding="utf-8") as f
    ):
        f.write(ntc_templates_info.model_dump_json())
