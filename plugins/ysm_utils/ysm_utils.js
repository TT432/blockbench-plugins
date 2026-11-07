"use strict";

var fs = require("fs"), path = require("path"), cryptoLib = require("crypto");

Language.addTranslations("en", {
  "menu.ysm_utils": "YSM",
  "level.ysm_utils.error": "Error",
  "level.ysm_utils.warning": "Warning",
  "menu.ysm_utils.required_fields": "Required Fields",
  "menu.ysm_utils.can_be_empty": "Can Be Empty",
  "menu.ysm_utils.suggest": "Suggest to write content",
  "menu.ysm_utils.delete": "Delete",
  "menu.ysm_utils.save": "Save",
  "menu.ysm_utils.save_quit": "Save & Quit",
  "menu.ysm_utils.save_success": "The file has been saved successfully",
  "menu.ysm_utils.exit_without_save": "Exit without Save",
  "color.ysm_utils.black.name": "Black",
  "color.ysm_utils.dark_blue.name": "Dark Blue",
  "color.ysm_utils.dark_green.name": "Dark Green",
  "color.ysm_utils.dark_aqua.name": "Dark Aqua",
  "color.ysm_utils.dark_red.name": "Dark Red",
  "color.ysm_utils.dark_purple.name": "Dark Purple",
  "color.ysm_utils.gold.name": "Gold",
  "color.ysm_utils.gray.name": "Gray",
  "color.ysm_utils.dark_gray.name": "Dark Gray",
  "color.ysm_utils.blue.name": "Blue",
  "color.ysm_utils.green.name": "Green",
  "color.ysm_utils.aqua.name": "Aqua",
  "color.ysm_utils.red.name": "Red",
  "color.ysm_utils.light_purple.name": "Light Purple",
  "color.ysm_utils.yellow.name": "Yellow",
  "color.ysm_utils.white.name": "White",
  "style.ysm_utils.bold.name": "Bold",
  "style.ysm_utils.strikethrough.name": "Strikethrough",
  "style.ysm_utils.underline.name": "Underline",
  "style.ysm_utils.italic.name": "Italic",
  "style.ysm_utils.reset.name": "Reset Text Format",
  "dialog.ysm_utils.language_edit.language.en_us": "English (US)",
  "dialog.ysm_utils.language_edit.language.zh_cn": "Simplified Chinese",
  "dialog.ysm_utils.language_edit.language.zh_tw": "Traditional Chinese",
  "dialog.ysm_utils.language_edit.language.ru_ru": "Russian",
  "dialog.ysm_utils.language_edit.language.ja_jp": "Japanese",
  "dialog.ysm_utils.language_edit.language.ko_kr": "Korean",
  "dialog.ysm_utils.language_edit.language.vi_vn": "Vietnamese",
  "dialog.ysm_utils.language_edit.language.pt_br": "Portuguese (Brazil)",
  "dialog.ysm_utils.language_edit.language.es_es": "Spanish",
  "dialog.ysm_utils.language_edit.language.id_id": "Indonesian",
  "dialog.ysm_utils.language_edit.language.tr_tr": "Turkish",
  "menu.ysm_utils.load_info_menu.name": "Load & Open Info",
  "menu.ysm_utils.load_info_menu.title": "Load and Open Info Menu",
  "menu.ysm_utils.load_info_menu.directory_error": "The directory is incorrect! There are no YSM related files in it!",
  "menu.ysm_utils.load_info_menu.transform_model": "The model is detected as an old version of YSM model and needs to be converted to the new version format.<br>Click the confirm button and select the new version export path!",
  "menu.ysm_utils.load_info_menu.save_tip": "Your file has been modified. Do you want to save it?",
  "menu.ysm_utils.load_info_menu.sidebar.metadata": "Meta Data",
  "menu.ysm_utils.load_info_menu.sidebar.properties": "Properties",
  "menu.ysm_utils.load_info_menu.sidebar.player_files": "Player Files",
  "menu.ysm_utils.load_info_menu.sidebar.projectile_files": "Projectile Files",
  "menu.ysm_utils.load_info_menu.sidebar.vehicle_files": "Vehicle Files",
  "menu.ysm_utils.load_info_menu.sidebar.language": "Language",
  "menu.ysm_utils.load_info_menu.metadata.name": "Model Name",
  "menu.ysm_utils.load_info_menu.metadata.name.desc": "Please enter a name for the model",
  "menu.ysm_utils.load_info_menu.metadata.tips": "Model Tips",
  "menu.ysm_utils.load_info_menu.metadata.tips.desc": "Please enter the tips for the model",
  "menu.ysm_utils.load_info_menu.metadata.license": "License",
  "menu.ysm_utils.load_info_menu.metadata.license.desc": "Select the license for the model, the default is All Rights Reserved",
  "menu.ysm_utils.load_info_menu.metadata.license.type": "Type",
  "menu.ysm_utils.load_info_menu.metadata.license.extra_desc": "Description",
  "menu.ysm_utils.load_info_menu.metadata.authors": "Authors",
  "menu.ysm_utils.load_info_menu.metadata.authors.desc": "Add the author or contributor of the model",
  "menu.ysm_utils.load_info_menu.metadata.authors.new": "Add New Author",
  "menu.ysm_utils.load_info_menu.metadata.authors.edit": "Edit Author",
  "menu.ysm_utils.load_info_menu.metadata.authors.name": "Author Name",
  "menu.ysm_utils.load_info_menu.metadata.authors.name.desc": "Author Name Desc",
  "menu.ysm_utils.load_info_menu.metadata.authors.role": "Author Role",
  "menu.ysm_utils.load_info_menu.metadata.authors.role.desc": "Author Role Desc",
  "menu.ysm_utils.load_info_menu.metadata.authors.contact": "Author Contact",
  "menu.ysm_utils.load_info_menu.metadata.authors.contact.desc": "Author Contact Desc",
  "menu.ysm_utils.load_info_menu.metadata.authors.contact.add": "Add New Contact",
  "menu.ysm_utils.load_info_menu.metadata.authors.comment": "Author Comment",
  "menu.ysm_utils.load_info_menu.metadata.authors.comment.desc": "Author Comment Desc",
  "menu.ysm_utils.load_info_menu.metadata.authors.config": "Config",
  "menu.ysm_utils.load_info_menu.metadata.authors.delete": "Delete The Author",
  "menu.ysm_utils.load_info_menu.metadata.authors.delete.message": "Do you want to delete this author?<br>This will also put the avatar into the recycle bin!",
  "menu.ysm_utils.load_info_menu.metadata.authors.need_author_name": "Author name is required",
  "menu.ysm_utils.load_info_menu.metadata.authors.select_author_avatar": "Select Author Avatar",
  "menu.ysm_utils.load_info_menu.metadata.authors.same_file": "The author's avatar with the same name exists.\nDo you want to overwrite it?",
  "menu.ysm_utils.load_info_menu.metadata.link": "Link",
  "menu.ysm_utils.load_info_menu.metadata.link.desc": "Model package related web links",
  "menu.ysm_utils.load_info_menu.metadata.link.home": "Home",
  "menu.ysm_utils.load_info_menu.metadata.link.donate": "Donate",
  "menu.ysm_utils.load_info_menu.properties.height_scale": "Height Scale",
  "menu.ysm_utils.load_info_menu.properties.height_scale.desc": "The height scale of the model, the default is 0.7",
  "menu.ysm_utils.load_info_menu.properties.width_scale": "Width Scale",
  "menu.ysm_utils.load_info_menu.properties.width_scale.desc": "The width scale of the model, the default is 0.7",
  "menu.ysm_utils.load_info_menu.properties.extra_animation": "Extra Animation",
  "menu.ysm_utils.load_info_menu.properties.extra_animation.desc": "Select the wheel animation and give it a display name",
  "menu.ysm_utils.load_info_menu.properties.extra_animation.add": "Add New",
  "menu.ysm_utils.load_info_menu.properties.extra_animation.key": "Extra Animation Key",
  "menu.ysm_utils.load_info_menu.properties.extra_animation.key.desc": "Can set the animation to play, or the sub-roulette that needs to be opened",
  "menu.ysm_utils.load_info_menu.properties.extra_animation.value": "Extra Animation Value",
  "menu.ysm_utils.load_info_menu.properties.extra_animation.value.desc": "Can set the displayed name or attach a configuration interface",
  "menu.ysm_utils.load_info_menu.properties.extra_animation.no_config": "No Config",
  "menu.ysm_utils.load_info_menu.properties.extra_animation.has_config": "Has Config",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_classify": "Extra Animation Classify",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_classify.desc": "Extra Animation Classify, for making sub-roulette",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons": "Extra Animation Buttons",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.desc": "Extra Animation Buttons, for add configuration interface for Roulette",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_classify.id": "Extra Animation Classify ID",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_classify.id.desc": "You need to set a unique name",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.id": "Extra Animation Buttons ID",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.id.desc": "You need to set a unique name",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.name": "Extra Animation Buttons Name",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.name.desc": "The name displayed on the roulette interface",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms": "Config Forms",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.desc": "You can modify the order by dragging with the mouse",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.type": "Forms Type",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.type.range": "Range",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.type.checkbox": "Checkbox",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.type.radio": "Radio",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.title": "Forms Title",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.description": "Forms Desc",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.value": "Forms Value",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.step": "Step",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.min": "Min",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.max": "Max",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.labels": "Labels",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.delete": "Are you sure you want to delete this form?",
  "menu.ysm_utils.load_info_menu.properties.preview_animation": "Preview Animation",
  "menu.ysm_utils.load_info_menu.properties.preview_animation.desc": "Preview animation played in the model selection screen",
  "menu.ysm_utils.load_info_menu.properties.default_texture": "Default Texture",
  "menu.ysm_utils.load_info_menu.properties.default_texture.desc": "Default texture for the model selection screen",
  "menu.ysm_utils.load_info_menu.properties.free": "Free",
  "menu.ysm_utils.load_info_menu.properties.free.desc": "When this is true, it cannot be set as an auth model",
  "menu.ysm_utils.load_info_menu.properties.render_layers_first": "Render Layers First",
  "menu.ysm_utils.load_info_menu.properties.render_layers_first.desc": "Specifies whether the vanilla model layers should be rendered before the ysm model",
  "menu.ysm_utils.load_info_menu.properties.disable_preview_rotation": "Disable Preview Rotation",
  "menu.ysm_utils.load_info_menu.properties.disable_preview_rotation.desc": "Disable the rotation in the GUI so that the characters face the screen, making it easier to create GUI animations",
  "menu.ysm_utils.load_info_menu.properties.all_cutout": "All Cutout",
  "menu.ysm_utils.load_info_menu.properties.all_cutout.desc": "All faces are culled, only useful when using negative scale to create stroke effects",
  "menu.ysm_utils.load_info_menu.properties.gui_foreground": "GUI Foreground",
  "menu.ysm_utils.load_info_menu.properties.gui_foreground.desc": "Foreground image for the model selection screen",
  "menu.ysm_utils.load_info_menu.properties.gui_background": "GUI Background",
  "menu.ysm_utils.load_info_menu.properties.gui_background.desc": "Background image for the model selection screen",
  "menu.ysm_utils.load_info_menu.properties.gui_no_lighting": "GUI No Lighting",
  "menu.ysm_utils.load_info_menu.properties.gui_no_lighting.desc": "Close the environment lighting effect in the model selection screen",
  "menu.ysm_utils.load_info_menu.files.import": "Import Model",
  "menu.ysm_utils.load_info_menu.files.import_main": "Import Main Model",
  "menu.ysm_utils.load_info_menu.files.import_arm": "Import Arm Model",
  "menu.ysm_utils.load_info_menu.files.player.model": "Player Model",
  "menu.ysm_utils.load_info_menu.files.player.model.desc": "Main player model file",
  "menu.ysm_utils.load_info_menu.files.player.model.main": "Main Model",
  "menu.ysm_utils.load_info_menu.files.player.model.arm": "Arm Model",
  "menu.ysm_utils.load_info_menu.files.player.animation": "Player Animations",
  "menu.ysm_utils.load_info_menu.files.player.animation.desc": "Main player animations file",
  "menu.ysm_utils.load_info_menu.files.player.animation.main": "Main Animation",
  "menu.ysm_utils.load_info_menu.files.player.animation.arm": "Arm Animation",
  "menu.ysm_utils.load_info_menu.files.player.animation.extra": "Extra Animation",
  "menu.ysm_utils.load_info_menu.files.player.animation.tac": "TAC Animation",
  "menu.ysm_utils.load_info_menu.files.player.animation.carryon": "Carry On Animation",
  "menu.ysm_utils.load_info_menu.files.player.animation.swem": "SWEM Animation",
  "menu.ysm_utils.load_info_menu.files.player.animation.parcool": "Parcool Animation",
  "menu.ysm_utils.load_info_menu.files.player.animation.slashblade": "Slash Blade Animation",
  "menu.ysm_utils.load_info_menu.files.player.animation.tlm": "Touhou Little Maid Animation",
  "menu.ysm_utils.load_info_menu.files.player.animation.fp_arm": "First Person Arm Animation",
  "menu.ysm_utils.load_info_menu.files.player.texture": "Player Texture",
  "menu.ysm_utils.load_info_menu.files.player.texture.desc": "Main player texture file",
  "menu.ysm_utils.load_info_menu.files.player.texture.uv": "UV Texture",
  "menu.ysm_utils.load_info_menu.files.player.texture.normal": "Normal Texture",
  "menu.ysm_utils.load_info_menu.files.player.texture.specular": "Specular Texture",
  "menu.ysm_utils.load_info_menu.files.player.animation_controllers": "Animation Controllers",
  "menu.ysm_utils.load_info_menu.files.player.animation_controllers.desc": "Animation controller, optional",
  "menu.ysm_utils.load_info_menu.files.player.animation_controllers.prefix": "Controller: %0",
  "menu.ysm_utils.load_info_menu.files.add_new_controllers": "Add New Animation Controller",
  "menu.ysm_utils.load_info_menu.files.other.match": "Match",
  "menu.ysm_utils.load_info_menu.files.other.match.desc": "Can be entity id or entity tag",
  "menu.ysm_utils.load_info_menu.files.other.match.add": "Add New Match",
  "menu.ysm_utils.load_info_menu.files.other.model": "Model",
  "menu.ysm_utils.load_info_menu.files.other.texture.uv": "UV Texture",
  "menu.ysm_utils.load_info_menu.files.other.texture.normal": "Normal Texture",
  "menu.ysm_utils.load_info_menu.files.other.texture.specular": "Specular Texture",
  "menu.ysm_utils.load_info_menu.files.other.animation": "Animation",
  "menu.ysm_utils.load_info_menu.files.other.controller": "Controller",
  "menu.ysm_utils.load_info_menu.files.select_files": "Select the file to replace",
  "menu.ysm_utils.load_info_menu.files.delete_files": "Do you want to delete this file? (move it to the Recycle Bin)",
  "menu.ysm_utils.load_info_menu.files.same_file": "File mounted successfully!",
  "menu.ysm_utils.load_info_menu.files.replace_success": "Successfully replaced the file",
  "menu.ysm_utils.load_info_menu.files.replace_success.remove_file": "Successfully replaced the file, the old file has been moved to the Recycle Bin",
  "menu.ysm_utils.load_info_menu.files.add_new_texture": "Add New Texture",
  "menu.ysm_utils.load_info_menu.files.delete_texture": "Delete Texture",
  "menu.ysm_utils.load_info_menu.files.delete_texture.tip": "Do you want to delete these texture files:",
  "menu.ysm_utils.load_info_menu.files.delete_files.tip": "Do you want to delete these files:",
  "menu.ysm_utils.load_info_menu.open_folder": "Open Folder",
  "menu.ysm_utils.old_version_transform.directory_exists": "A folder with the same name already exists!",
  "menu.ysm_utils.old_version_transform.select_output_directory": "Select Output Directory",
  "menu.ysm_utils.old_version_transform.success": "The export is successful, and the export path is: ",
  "menu.ysm_utils.cache_info_menu.name": "Open Recent Model",
  "menu.ysm_utils.cache_info_menu.clear_all": "Clear All",
  "menu.ysm_utils.current_info_menu.name": "Edit Current Info",
  "menu.ysm_utils.current_info_menu.no_info": "The current model has no associated information",
  "menu.ysm_utils.current_info_menu.status_bar_text": "Java YSM Model File",
  "menu.ysm_utils.direct_import.name": "Direct Import",
  "menu.ysm_utils.direct_import.import_animation": "Import Animation",
  "menu.ysm_utils.direct_import.import_animation_controller": "Import Animation Controller",
  "menu.ysm_utils.file_import.missing_field": "Error: The ysm.json file is missing the '%0' field",
  "menu.ysm_utils.file_import.missing_file": "Error: %0 file is missing",
  "menu.ysm_utils.import_type.player_main": "Player Main Model",
  "menu.ysm_utils.import_type.player_arm": "Player Arm Model",
  "menu.ysm_utils.create_default_model": "Create Default Model",
  "menu.ysm_utils.create_default_model.select_output_directory": "Select Output Directory",
  "menu.ysm_utils.create_default_model.pack_name": "Pack Name",
  "menu.ysm_utils.create_default_model.pack_name.placeholder": "Enter the pack name, support any characters",
  "menu.ysm_utils.create_default_model.same_folder": "A folder with the same name exists",
  "menu.ysm_utils.add_new_model": "Add New Model",
  "menu.ysm_utils.add_new_model.entity_id": "Entity ID",
  "menu.ysm_utils.add_new_model.entity_id.placeholder": "Enter the entity ID",
  "menu.ysm_utils.add_new_model.entity_id.exist": "Entity ID already exists",
  "menu.ysm_utils.add_new_model.entity_id.format_error": "Entity ID Format error",
  "menu.ysm_utils.add_new_model.entity_id.select": "Select",
  "menu.ysm_utils.add_new_model.entity_id.custom_input": "Custom Input...",
  "ysm.minecraft.arrow": "Arrow",
  "ysm.minecraft.spectral_arrow": "Spectral Arrow",
  "ysm.minecraft.trident": "Trident",
  "ysm.minecraft.snowball": "Snowball",
  "ysm.minecraft.egg": "Egg",
  "ysm.minecraft.splash_potion": "Splash Potion",
  "ysm.minecraft.lingering_potion": "Lingering Potion",
  "ysm.minecraft.experience_bottle": "Experience Bottle",
  "ysm.minecraft.ender_pearl": "Ender Pearl",
  "ysm.minecraft.firework_rocket": "Firework Rocket",
  "ysm.minecraft.fishing_bobber": "Fishing Bobber",
  "ysm.minecraft.wind_charge": "Wind Charge",
  "ysm.minecraft.boat": "Boat",
  "ysm.minecraft.chest_boat": "Chest Boat",
  "ysm.minecraft.minecart": "Minecart",
  "ysm.minecraft.camel": "Camel",
  "ysm.minecraft.donkey": "Donkey",
  "ysm.minecraft.horse": "Horse",
  "ysm.minecraft.llama": "Llama",
  "ysm.minecraft.mule": "Mule",
  "ysm.minecraft.pig": "Pig",
  "ysm.minecraft.skeleton_horse": "Skeleton Horse",
  "ysm.minecraft.strider": "Strider",
  "ysm.minecraft.zombie_horse": "Zombie Horse"
}), Language.addTranslations("zh", {
  "menu.ysm_utils": "YSM",
  "level.ysm_utils.error": "错误",
  "level.ysm_utils.warning": "警告",
  "menu.ysm_utils.required_fields": "必填项",
  "menu.ysm_utils.can_be_empty": "选填项",
  "menu.ysm_utils.suggest": "建议填入内容",
  "menu.ysm_utils.delete": "删除",
  "menu.ysm_utils.save": "保存",
  "menu.ysm_utils.save_quit": "保存并退出",
  "menu.ysm_utils.save_success": "文件已经保存成功",
  "menu.ysm_utils.exit_without_save": "不保存并退出",
  "color.ysm_utils.black.name": "黑色",
  "color.ysm_utils.dark_blue.name": "深蓝色",
  "color.ysm_utils.dark_green.name": "深绿色",
  "color.ysm_utils.dark_aqua.name": "湖蓝色",
  "color.ysm_utils.dark_red.name": "深红色",
  "color.ysm_utils.dark_purple.name": "紫色",
  "color.ysm_utils.gold.name": "金色",
  "color.ysm_utils.gray.name": "灰色",
  "color.ysm_utils.dark_gray.name": "深灰色",
  "color.ysm_utils.blue.name": "蓝色",
  "color.ysm_utils.green.name": "绿色",
  "color.ysm_utils.aqua.name": "天蓝色",
  "color.ysm_utils.red.name": "红色",
  "color.ysm_utils.light_purple.name": "粉红色",
  "color.ysm_utils.yellow.name": "黄色",
  "color.ysm_utils.white.name": "白色",
  "style.ysm_utils.bold.name": "粗体",
  "style.ysm_utils.strikethrough.name": "删除线",
  "style.ysm_utils.underline.name": "下划线",
  "style.ysm_utils.italic.name": "斜体",
  "style.ysm_utils.reset.name": "重置文字样式",
  "dialog.ysm_utils.language_edit.language.en_us": "英语（美国）",
  "dialog.ysm_utils.language_edit.language.zh_cn": "简体中文",
  "dialog.ysm_utils.language_edit.language.zh_tw": "繁体中文",
  "dialog.ysm_utils.language_edit.language.ru_ru": "俄语",
  "dialog.ysm_utils.language_edit.language.ja_jp": "日语",
  "dialog.ysm_utils.language_edit.language.ko_kr": "韩语",
  "dialog.ysm_utils.language_edit.language.vi_vn": "越南语",
  "dialog.ysm_utils.language_edit.language.pt_br": "葡萄牙语（巴西）",
  "dialog.ysm_utils.language_edit.language.es_es": "西班牙语",
  "dialog.ysm_utils.language_edit.language.id_id": "印尼语",
  "dialog.ysm_utils.language_edit.language.tr_tr": "土耳其语",
  "menu.ysm_utils.load_info_menu.name": "加载并打开信息",
  "menu.ysm_utils.load_info_menu.title": "加载并打开信息菜单",
  "menu.ysm_utils.load_info_menu.directory_error": "目录错误！里面没有任何与 YSM 相关的文件！",
  "menu.ysm_utils.load_info_menu.transform_model": "检测到该文件夹里的 YSM 模型为旧版模型，需要转换成新版模型格式。<br>点击确定按钮，并选择新版本的导出路径！",
  "menu.ysm_utils.load_info_menu.save_tip": "检测到你已经做了更改，是否要保存文件？",
  "menu.ysm_utils.load_info_menu.sidebar.metadata": "基础内容",
  "menu.ysm_utils.load_info_menu.sidebar.properties": "模型属性",
  "menu.ysm_utils.load_info_menu.sidebar.player_files": "玩家相关文件",
  "menu.ysm_utils.load_info_menu.sidebar.projectile_files": "投掷物",
  "menu.ysm_utils.load_info_menu.sidebar.vehicle_files": "载具",
  "menu.ysm_utils.load_info_menu.sidebar.language": "语言文件",
  "menu.ysm_utils.load_info_menu.metadata.name": "模型名",
  "menu.ysm_utils.load_info_menu.metadata.name.desc": "请输入模型的名称",
  "menu.ysm_utils.load_info_menu.metadata.tips": "模型提示文本",
  "menu.ysm_utils.load_info_menu.metadata.tips.desc": "请输入模型提示文本",
  "menu.ysm_utils.load_info_menu.metadata.license": "许可协议",
  "menu.ysm_utils.load_info_menu.metadata.license.desc": "选择模型的许可协议，默认为保留最终所有权（All Rights Reserved）",
  "menu.ysm_utils.load_info_menu.metadata.license.type": "类型",
  "menu.ysm_utils.load_info_menu.metadata.license.extra_desc": "描述文本",
  "menu.ysm_utils.load_info_menu.metadata.authors": "作者",
  "menu.ysm_utils.load_info_menu.metadata.authors.desc": "添加该模型的作者或者贡献者",
  "menu.ysm_utils.load_info_menu.metadata.authors.new": "添加新的作者",
  "menu.ysm_utils.load_info_menu.metadata.authors.edit": "编辑作者",
  "menu.ysm_utils.load_info_menu.metadata.authors.name": "作者名称",
  "menu.ysm_utils.load_info_menu.metadata.authors.name.desc": "填入作者名称",
  "menu.ysm_utils.load_info_menu.metadata.authors.role": "作者角色",
  "menu.ysm_utils.load_info_menu.metadata.authors.role.desc": "填入作者角色",
  "menu.ysm_utils.load_info_menu.metadata.authors.contact": "作者联系方式",
  "menu.ysm_utils.load_info_menu.metadata.authors.contact.desc": "填入作者联系方式",
  "menu.ysm_utils.load_info_menu.metadata.authors.contact.add": "添加新的联系方式",
  "menu.ysm_utils.load_info_menu.metadata.authors.comment": "作者描述文本",
  "menu.ysm_utils.load_info_menu.metadata.authors.comment.desc": "添加作者描述文本",
  "menu.ysm_utils.load_info_menu.metadata.authors.config": "修改",
  "menu.ysm_utils.load_info_menu.metadata.authors.delete": "删除该作者",
  "menu.ysm_utils.load_info_menu.metadata.authors.delete.message": "你真的打算删除该作者么？<br>这也会一并将头像也放入回收站！",
  "menu.ysm_utils.load_info_menu.metadata.authors.need_author_name": "作者名称是必填内容",
  "menu.ysm_utils.load_info_menu.metadata.authors.select_author_avatar": "选择作者头像",
  "menu.ysm_utils.load_info_menu.metadata.authors.same_file": "头像存在同名文件\n你打算覆盖它么？",
  "menu.ysm_utils.load_info_menu.metadata.link": "链接",
  "menu.ysm_utils.load_info_menu.metadata.link.desc": "模型包相关链接",
  "menu.ysm_utils.load_info_menu.metadata.link.home": "主页",
  "menu.ysm_utils.load_info_menu.metadata.link.donate": "捐赠",
  "menu.ysm_utils.load_info_menu.properties.height_scale": "高度缩放",
  "menu.ysm_utils.load_info_menu.properties.height_scale.desc": "模型的高度缩放，默认是 0.7",
  "menu.ysm_utils.load_info_menu.properties.width_scale": "宽度缩放",
  "menu.ysm_utils.load_info_menu.properties.width_scale.desc": "模型的宽度缩放，默认是 0.7",
  "menu.ysm_utils.load_info_menu.properties.extra_animation": "轮盘动画",
  "menu.ysm_utils.load_info_menu.properties.extra_animation.desc": "选择轮盘动画并为它添加名称",
  "menu.ysm_utils.load_info_menu.properties.extra_animation.add": "新建",
  "menu.ysm_utils.load_info_menu.properties.extra_animation.key": "轮盘动画 Key",
  "menu.ysm_utils.load_info_menu.properties.extra_animation.key.desc": "可以设置需要播放的动画，或者需要打开的子轮盘",
  "menu.ysm_utils.load_info_menu.properties.extra_animation.value": "轮盘动画 Value",
  "menu.ysm_utils.load_info_menu.properties.extra_animation.value.desc": "可以设置显示的名称，或者附加配置界面",
  "menu.ysm_utils.load_info_menu.properties.extra_animation.no_config": "没有配置界面",
  "menu.ysm_utils.load_info_menu.properties.extra_animation.has_config": "含有配置界面",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_classify": "子轮盘动画",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_classify.desc": "子轮盘动画，用于制作子轮盘动画",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons": "轮盘配置",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.desc": "轮盘配置，用于为轮盘添加配置界面",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_classify.id": "子轮盘 ID",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_classify.id.desc": "需要设置一个不重复的名称",
  "menu.ysm_utils.load_info_menu.properties.preview_animation": "预览界面动画",
  "menu.ysm_utils.load_info_menu.properties.preview_animation.desc": "模型选择界面播放的预览动画",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.id": "轮盘配置 ID",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.id.desc": "需要设置一个不重复的名称",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.name": "轮盘配置显示名",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.name.desc": "显示在轮盘界面的名称",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms": "配置组件",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.desc": "可以用鼠标拖拽修改顺序",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.type": "组件类型",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.type.range": "滑条",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.type.checkbox": "开关",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.type.radio": "单选框",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.title": "组件名称",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.description": "组件描述",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.value": "组件值",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.step": "每次变化值",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.min": "最小值",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.max": "最大值",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.labels": "单选框选项",
  "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.delete": "你确定要删除此表单么？",
  "menu.ysm_utils.load_info_menu.properties.default_texture": "默认材质",
  "menu.ysm_utils.load_info_menu.properties.default_texture.desc": "模型选择界面的默认显示材质",
  "menu.ysm_utils.load_info_menu.properties.free": "非授权模型",
  "menu.ysm_utils.load_info_menu.properties.free.desc": "当勾选此选项时，模型在服务器上将不得设置为授权类型",
  "menu.ysm_utils.load_info_menu.properties.render_layers_first": "渲染层级优先",
  "menu.ysm_utils.load_info_menu.properties.render_layers_first.desc": "指定原版模型层级的渲染是否先于 ysm 模型",
  "menu.ysm_utils.load_info_menu.properties.disable_preview_rotation": "禁用模型选择界面旋转",
  "menu.ysm_utils.load_info_menu.properties.disable_preview_rotation.desc": "用于禁用模型选择界面的旋转，方便制作 GUI 动画",
  "menu.ysm_utils.load_info_menu.properties.all_cutout": "全面剔除",
  "menu.ysm_utils.load_info_menu.properties.all_cutout.desc": "当设置为 true 时，无论材质情况，全部启用面剔除。用于支持负尺寸描边模型",
  "menu.ysm_utils.load_info_menu.properties.gui_foreground": "GUI 前景图",
  "menu.ysm_utils.load_info_menu.properties.gui_foreground.desc": "在模型选择界面显示的前景图",
  "menu.ysm_utils.load_info_menu.properties.gui_background": "GUI 背景图",
  "menu.ysm_utils.load_info_menu.properties.gui_background.desc": "在模型选择界面显示的背景图",
  "menu.ysm_utils.load_info_menu.properties.gui_no_lighting": "关闭 GUI 光照",
  "menu.ysm_utils.load_info_menu.properties.gui_no_lighting.desc": "在模型选择界面关闭环境光照",
  "menu.ysm_utils.load_info_menu.files.import": "导入模型",
  "menu.ysm_utils.load_info_menu.files.import_main": "导入主模型",
  "menu.ysm_utils.load_info_menu.files.import_arm": "导入手臂模型",
  "menu.ysm_utils.load_info_menu.files.player.model": "玩家模型",
  "menu.ysm_utils.load_info_menu.files.player.model.desc": "玩家模型相关文件",
  "menu.ysm_utils.load_info_menu.files.player.model.main": "主模型",
  "menu.ysm_utils.load_info_menu.files.player.model.arm": "手臂模型",
  "menu.ysm_utils.load_info_menu.files.player.animation": "玩家动画",
  "menu.ysm_utils.load_info_menu.files.player.animation.desc": "主玩家动画相关文件",
  "menu.ysm_utils.load_info_menu.files.player.animation.main": "主动画",
  "menu.ysm_utils.load_info_menu.files.player.animation.arm": "手部动画",
  "menu.ysm_utils.load_info_menu.files.player.animation.extra": "轮盘动画",
  "menu.ysm_utils.load_info_menu.files.player.animation.tac": "TAC 枪械动画",
  "menu.ysm_utils.load_info_menu.files.player.animation.carryon": "Carry On 动画",
  "menu.ysm_utils.load_info_menu.files.player.animation.swem": "SWEM 马术动画",
  "menu.ysm_utils.load_info_menu.files.player.animation.parcool": "跑酷动画",
  "menu.ysm_utils.load_info_menu.files.player.animation.slashblade": "拔刀剑动画",
  "menu.ysm_utils.load_info_menu.files.player.animation.tlm": "车万女仆动画",
  "menu.ysm_utils.load_info_menu.files.player.animation.fp_arm": "第一人称手臂动画",
  "menu.ysm_utils.load_info_menu.files.player.texture": "玩家材质",
  "menu.ysm_utils.load_info_menu.files.player.texture.desc": "玩家材质相关文件",
  "menu.ysm_utils.load_info_menu.files.player.texture.uv": "贴图",
  "menu.ysm_utils.load_info_menu.files.player.texture.normal": "法线贴图",
  "menu.ysm_utils.load_info_menu.files.player.texture.specular": "高光贴图",
  "menu.ysm_utils.load_info_menu.files.player.animation_controllers": "动画控制器",
  "menu.ysm_utils.load_info_menu.files.player.animation_controllers.prefix": "控制器：%0",
  "menu.ysm_utils.load_info_menu.files.player.animation_controllers.desc": "动画控制器，可选",
  "menu.ysm_utils.load_info_menu.files.add_new_controllers": "添加新的动画控制器",
  "menu.ysm_utils.load_info_menu.files.other.match": "匹配实体",
  "menu.ysm_utils.load_info_menu.files.other.match.desc": "可以填写实体 id 或实体 tag",
  "menu.ysm_utils.load_info_menu.files.other.match.add": "添加新的匹配项",
  "menu.ysm_utils.load_info_menu.files.other.model": "模型",
  "menu.ysm_utils.load_info_menu.files.other.texture.uv": "贴图",
  "menu.ysm_utils.load_info_menu.files.other.texture.normal": "法线贴图",
  "menu.ysm_utils.load_info_menu.files.other.texture.specular": "高光贴图",
  "menu.ysm_utils.load_info_menu.files.other.animation": "动画",
  "menu.ysm_utils.load_info_menu.files.other.controller": "控制器",
  "menu.ysm_utils.load_info_menu.files.select_files": "选择需要替换的文件",
  "menu.ysm_utils.load_info_menu.files.delete_files": "你要删除此文件么（移动至回收站）",
  "menu.ysm_utils.load_info_menu.files.same_file": "文件挂载成功！",
  "menu.ysm_utils.load_info_menu.files.replace_success.remove_file": "成功替换文件，旧文件已经移动至回收站",
  "menu.ysm_utils.load_info_menu.files.replace_success": "成功替换文件",
  "menu.ysm_utils.load_info_menu.files.add_new_texture": "添加新材质",
  "menu.ysm_utils.load_info_menu.files.delete_texture": "删除材质",
  "menu.ysm_utils.load_info_menu.files.delete_texture.tip": "你打算删除这些材质么：",
  "menu.ysm_utils.load_info_menu.files.delete_files.tip": "你打算删除这些文件么：",
  "menu.ysm_utils.load_info_menu.open_folder": "打开文件夹",
  "menu.ysm_utils.old_version_transform.directory_exists": "同名文件夹已经存在了！",
  "menu.ysm_utils.old_version_transform.select_output_directory": "选择导出文件夹",
  "menu.ysm_utils.old_version_transform.success": "导出成功，导出路径是：",
  "menu.ysm_utils.cache_info_menu.name": "打开历史模型",
  "menu.ysm_utils.cache_info_menu.clear_all": "清除所有",
  "menu.ysm_utils.current_info_menu.name": "编辑当前信息",
  "menu.ysm_utils.current_info_menu.no_info": "当前模型没有关联信息",
  "menu.ysm_utils.current_info_menu.status_bar_text": "Java YSM 模型文件",
  "menu.ysm_utils.direct_import.name": "直接导入",
  "menu.ysm_utils.direct_import.import_animation": "导入动画",
  "menu.ysm_utils.direct_import.import_animation_controller": "导入动画控制器",
  "menu.ysm_utils.file_import.missing_field": "错误：ysm.json 文件缺失“%0”字段",
  "menu.ysm_utils.file_import.missing_file": "错误：%0 文件缺失",
  "menu.ysm_utils.import_type.player_main": "玩家主模型",
  "menu.ysm_utils.import_type.player_arm": "玩家手臂模型",
  "menu.ysm_utils.create_default_model": "创建默认模型",
  "menu.ysm_utils.create_default_model.select_output_directory": "选择输出文件夹",
  "menu.ysm_utils.create_default_model.pack_name": "模型包名",
  "menu.ysm_utils.create_default_model.pack_name.placeholder": "输入模型包名，支持任意字符",
  "menu.ysm_utils.create_default_model.same_folder": "同名文件夹已存在",
  "menu.ysm_utils.add_new_model": "添加新模型",
  "menu.ysm_utils.add_new_model.entity_id": "实体 ID",
  "menu.ysm_utils.add_new_model.entity_id.placeholder": "输入实体 ID",
  "menu.ysm_utils.add_new_model.entity_id.exist": "实体 ID 已存在",
  "menu.ysm_utils.add_new_model.entity_id.format_error": "实体 ID 格式错误",
  "menu.ysm_utils.add_new_model.entity_id.select": "请选择",
  "menu.ysm_utils.add_new_model.entity_id.custom_input": "自定义输入...",
  "ysm.minecraft.arrow": "箭",
  "ysm.minecraft.spectral_arrow": "光灵箭",
  "ysm.minecraft.trident": "三叉戟",
  "ysm.minecraft.snowball": "雪球",
  "ysm.minecraft.egg": "鸡蛋",
  "ysm.minecraft.splash_potion": "喷溅型药水",
  "ysm.minecraft.lingering_potion": "滞留型药水",
  "ysm.minecraft.experience_bottle": "经验瓶",
  "ysm.minecraft.ender_pearl": "末影珍珠",
  "ysm.minecraft.firework_rocket": "烟花火箭",
  "ysm.minecraft.fishing_bobber": "鱼漂",
  "ysm.minecraft.wind_charge": "风弹",
  "ysm.minecraft.boat": "船",
  "ysm.minecraft.chest_boat": "运输船",
  "ysm.minecraft.minecart": "矿车",
  "ysm.minecraft.camel": "骆驼",
  "ysm.minecraft.donkey": "驴",
  "ysm.minecraft.horse": "马",
  "ysm.minecraft.llama": "羊驼",
  "ysm.minecraft.mule": "骡",
  "ysm.minecraft.pig": "猪",
  "ysm.minecraft.skeleton_horse": "骷髅马",
  "ysm.minecraft.strider": "炽足兽",
  "ysm.minecraft.zombie_horse": "僵尸马"
});

var packageInfo_author = "tartaric_acid", packageInfo_description = "Yes Steve Model Mod Blockbench Plugin";

const ysmCommunityNative = (() => {
  const legacy = "undefined" == typeof electron ? null : electron, requestModule = "function" == typeof requireNativeModule ? requireNativeModule : require, modules = Object.create(null);
  function nativeModule(name) {
    if (legacy && legacy[name]) return legacy[name];
    if (modules[name]) return modules[name];
    const api = requestModule(name, {
      optional: !0,
      message: "dialog" === name ? "YSM uses native confirmation dialogs before saving or overwriting files." : "YSM opens model folders and moves removed model assets to the recycle bin."
    });
    if (!api) {
      const message = "YSM: native " + name + " access was not granted; the operation was canceled.";
      throw Blockbench.showQuickMessage(message, 5e3), new Error(message);
    }
    return modules[name] = api, api;
  }
  return {
    loadAnimationFile(file) {
      const codec = "undefined" != typeof AnimationCodec && AnimationCodec.codecs ? AnimationCodec.codecs.bedrock : null;
      return codec ? codec.loadFile(file) : Animator.loadFile(file);
    },
    dialog: {
      async showOpenDialog(options) {
        if (legacy && legacy.dialog) return legacy.dialog.showOpenDialog(options);
        const properties = options.properties || [];
        let filePaths = [];
        if (properties.includes("openDirectory")) {
          const directory = Blockbench.pickDirectory({
            title: options.title,
            startpath: options.defaultPath
          });
          directory && filePaths.push(directory);
        } else {
          const filters = options.filters || [];
          Blockbench.import({
            title: options.title,
            startpath: options.defaultPath,
            type: filters.map(filter => filter.name).join(", ") || "Files",
            extensions: [ ...new Set(filters.flatMap(filter => filter.extensions)) ],
            multiple: properties.includes("multiSelections"),
            readtype: "none"
          }, files => {
            filePaths = files.map(file => file.path);
          });
        }
        return {
          canceled: 0 === filePaths.length,
          filePaths: filePaths
        };
      },
      showMessageBoxSync: options => nativeModule("dialog").showMessageBoxSync(options)
    },
    shell: {
      openPath: filePath => nativeModule("shell").openPath(filePath),
      trashItem: filePath => nativeModule("shell").trashItem(filePath)
    }
  };
})();

function copyFile(srcPath, srcFileName, destPath) {
  let srcFilePath = path.join(srcPath, srcFileName);
  if (fs.existsSync(srcFilePath)) {
    let destFilePath = path.join(destPath, srcFileName);
    fs.copyFileSync(srcFilePath, destFilePath);
  }
}

function oldVersionTransform(srcPackPath, destPath, isVersion114) {
  let srcPackName = pathToName(srcPackPath, !1), destPackPath = path.join(destPath, srcPackName);
  if (fs.existsSync(destPackPath)) return void Blockbench.showMessageBox({
    icon: "fa-warning",
    title: tl("level.ysm_utils.warning"),
    message: tl("menu.ysm_utils.old_version_transform.directory_exists")
  });
  !function(destPackPath, srcPackPath) {
    let animationsPath = path.join(destPackPath, "animations"), avatarsPath = path.join(destPackPath, "avatars"), modelsPath = path.join(destPackPath, "models"), texturesPath = path.join(destPackPath, "textures");
    fs.mkdirSync(destPackPath, {
      recursive: !0
    }), fs.mkdirSync(animationsPath, {
      recursive: !0
    }), fs.mkdirSync(avatarsPath, {
      recursive: !0
    }), fs.mkdirSync(modelsPath, {
      recursive: !0
    }), fs.mkdirSync(texturesPath, {
      recursive: !0
    }), copyFile(srcPackPath, "main.animation.json", animationsPath), copyFile(srcPackPath, "arm.animation.json", animationsPath), 
    copyFile(srcPackPath, "extra.animation.json", animationsPath), copyFile(srcPackPath, "tac.animation.json", animationsPath), 
    copyFile(srcPackPath, "carryon.animation.json", animationsPath), copyFile(srcPackPath, "arrow.animation.json", animationsPath), 
    copyFile(srcPackPath, "main.json", modelsPath), copyFile(srcPackPath, "arm.json", modelsPath), 
    copyFile(srcPackPath, "arrow.json", modelsPath), fs.readdirSync(srcPackPath).forEach(file => {
      file.endsWith(".png") && copyFile(srcPackPath, file, texturesPath);
    });
  }(destPackPath, srcPackPath);
  let ysmExtraInfo, mainFile = path.join(srcPackPath, "main.json"), mainFileJson = autoParseJSON(fs.readFileSync(mainFile, {
    encoding: "utf8"
  }));
  if (isVersion114) ysmExtraInfo = mainFileJson["minecraft:geometry"][0].description.ysm_extra_info; else {
    let infoFile = path.join(srcPackPath, "info.json");
    ysmExtraInfo = autoParseJSON(fs.readFileSync(infoFile, {
      encoding: "utf8"
    }));
  }
  let outputYsmData = {
    spec: 2
  }, metadata = outputYsmData.metadata = {};
  ysmExtraInfo ? function(data, metadata, ysmExtraInfo, srcPackName) {
    let properties = data.properties = {};
    if (metadata.name = ysmExtraInfo.name ?? srcPackName, ysmExtraInfo.tips && (metadata.tips = ysmExtraInfo.tips), 
    ysmExtraInfo.license && (metadata.license = {
      type: ysmExtraInfo.license
    }), ysmExtraInfo.authors) {
      let destAuthors = metadata.authors = [];
      ysmExtraInfo.authors.forEach(srcAuthor => destAuthors.push({
        name: srcAuthor
      }));
    }
    if (ysmExtraInfo.extra_animation_names) {
      let extraAnimations = properties.extra_animation = {}, index = 0;
      ysmExtraInfo.extra_animation_names.forEach(name => {
        extraAnimations[`extra${index}`] = name, index++;
      });
    }
    ysmExtraInfo.free && (properties.free = ysmExtraInfo.free), data.properties || delete data.properties;
  }(outputYsmData, metadata, ysmExtraInfo, srcPackName) : metadata.name = srcPackName, 
  function(mainFileJson, outputYsmData) {
    let description = mainFileJson["minecraft:geometry"][0].description;
    description.ysm_height_scale && .7 !== description.ysm_height_scale && (outputYsmData.properties || (outputYsmData.properties = {}), 
    outputYsmData.properties.height_scale = description.ysm_height_scale), description.ysm_width_scale && .7 !== description.ysm_width_scale && (outputYsmData.properties || (outputYsmData.properties = {}), 
    outputYsmData.properties.width_scale = description.ysm_width_scale);
  }(mainFileJson, outputYsmData);
  let files = outputYsmData.files = {};
  return function(files, srcPackPath) {
    let player = files.player = {}, model = {};
    fs.existsSync(path.join(srcPackPath, "main.json")) && (model.main = "models/main.json"), 
    fs.existsSync(path.join(srcPackPath, "arm.json")) && (model.arm = "models/arm.json"), 
    player.model = model;
    let animation = {};
    fs.existsSync(path.join(srcPackPath, "main.animation.json")) && (animation.main = "animations/main.animation.json"), 
    fs.existsSync(path.join(srcPackPath, "arm.animation.json")) && (animation.arm = "animations/arm.animation.json"), 
    fs.existsSync(path.join(srcPackPath, "extra.animation.json")) && (animation.extra = "animations/extra.animation.json"), 
    fs.existsSync(path.join(srcPackPath, "tac.animation.json")) && (animation.tac = "animations/tac.animation.json"), 
    fs.existsSync(path.join(srcPackPath, "carryon.animation.json")) && (animation.carryon = "animations/carryon.animation.json"), 
    player.animation = animation;
    let texture = [];
    fs.readdirSync(srcPackPath).forEach(file => {
      file.endsWith(".png") && "arrow.png" !== file && texture.push(`textures/${file}`);
    }), player.texture = texture;
  }(files, srcPackPath), function(srcPackPath, files) {
    let arrow = {};
    fs.existsSync(path.join(srcPackPath, "arrow.json")) && (arrow.match = [ "#minecraft:arrows" ], 
    arrow.model = "models/arrow.json", fs.existsSync(path.join(srcPackPath, "arrow.png")) && (arrow.texture = "textures/arrow.png"), 
    fs.existsSync(path.join(srcPackPath, "arrow.animation.png")) && (arrow.animation = "animations/arrow.animation.json"), 
    files.projectiles ??= [], files.projectiles.push(arrow));
  }(srcPackPath, files), fs.writeFileSync(path.join(destPackPath, "ysm.json"), autoStringify(outputYsmData)), 
  Blockbench.showQuickMessage(tl("menu.ysm_utils.old_version_transform.success") + destPackPath, 3e3), 
  destPackPath;
}

function arePathsEqual(path1, path2) {
  if (!fs.existsSync(path1) || !fs.existsSync(path2)) return !1;
  try {
    const stat1 = fs.statSync(path1), stat2 = fs.statSync(path2);
    if (stat1.ino && stat2.ino && stat1.dev === stat2.dev) return stat1.ino === stat2.ino;
    const absolutePath1 = path.resolve(path1), absolutePath2 = path.resolve(path2);
    return "win32" === SystemInfo.platform ? absolutePath1.toLowerCase() === absolutePath2.toLowerCase() : absolutePath1 === absolutePath2;
  } catch (err) {
    return console.error("Error resolving paths:", err), !1;
  }
}

const SUPPORTED_IMAGE_TYPES = [ "png", "avif", "webp", "jpeg", "jpg" ];

var script$a = {
  props: {
    newAuthorDialog: {
      type: Object,
      required: !0
    },
    authors: {
      type: Array,
      required: !0
    },
    packDirectory: {
      type: Object,
      required: !0
    },
    authorIndex: {
      type: Number,
      required: !0
    },
    newAuthor: {
      type: Object,
      default: function() {
        return {
          name: "",
          avatar: "",
          role: "",
          contact: {},
          comment: ""
        };
      }
    }
  },
  beforeMount() {
    this.newAuthor.avatar && (this.avatarImgPath = path.join(this.packDirectory, this.newAuthor.avatar));
  },
  data: () => ({
    avatarImgPath: ""
  }),
  computed: {
    tmpContact: function() {
      let output = [];
      for (let key in this.newAuthor.contact) output.push([ key, this.newAuthor.contact[key] ]);
      return output;
    },
    isEditAction: function() {
      return this.authorIndex >= 0;
    }
  },
  methods: {
    join: path.join,
    tl: tl,
    deleteAuthor: function() {
      Blockbench.showMessageBox({
        icon: "fa-warning",
        title: tl("level.ysm_utils.warning"),
        message: tl("menu.ysm_utils.load_info_menu.metadata.authors.delete.message"),
        buttons: [ tl("dialog.confirm"), tl("dialog.cancel") ],
        confirm: 0,
        cancel: 1
      }, button => {
        if (0 === button && this.isEditAction) {
          let deleteAuthors = this.authors.splice(this.authorIndex, 1);
          if (deleteAuthors[0].avatar) {
            let avatarPath = path.join(this.packDirectory, deleteAuthors[0].avatar);
            fs.existsSync(avatarPath) && ysmCommunityNative.shell.trashItem(avatarPath);
          }
          this.newAuthorDialog.close();
        }
      });
    },
    addAuthor: function() {
      if (!this.newAuthor.name) {
        let tip = tl("menu.ysm_utils.load_info_menu.metadata.authors.need_author_name");
        return void Blockbench.showQuickMessage(tip, 3e3);
      }
      let testAvatarImgPath = path.join(this.packDirectory, this.newAuthor.avatar);
      if (this.avatarImgPath && !arePathsEqual(testAvatarImgPath, this.avatarImgPath)) {
        let fileName = pathToName(this.avatarImgPath, !0), destFolderPath = path.join(this.packDirectory, "avatar"), destPath = path.join(destFolderPath, fileName);
        if (fs.existsSync(destPath)) {
          if (0 !== ysmCommunityNative.dialog.showMessageBoxSync({
            type: "warning",
            title: tl("level.ysm_utils.warning"),
            message: tl("menu.ysm_utils.load_info_menu.metadata.authors.same_file"),
            buttons: [ tl("dialog.confirm"), tl("dialog.cancel") ]
          })) return;
        }
        fs.existsSync(destFolderPath) || fs.mkdirSync(destFolderPath, {
          recursive: !0
        }), fs.copyFileSync(this.avatarImgPath, destPath), this.newAuthor.avatar = `avatar/${fileName}`;
      }
      let tmp = {};
      for (let value of this.tmpContact) value[0] && value[1] && (tmp[value[0]] = value[1]);
      this.newAuthor.contact = tmp, this.isEditAction ? (this.authors.splice(this.authorIndex, 1), 
      this.authors.splice(this.authorIndex, 0, this.newAuthor)) : this.authors.push(this.newAuthor), 
      this.newAuthorDialog.close();
    },
    addNewContact: function() {
      this.tmpContact.push([ "", "" ]), this.$forceUpdate();
    },
    deleteContact: function(index) {
      this.tmpContact.splice(index, 1), this.$forceUpdate();
    },
    addAvatarImg: function() {
      ysmCommunityNative.dialog.showOpenDialog({
        title: tl("menu.ysm_utils.load_info_menu.metadata.authors.select_author_avatar"),
        filters: [ {
          extensions: SUPPORTED_IMAGE_TYPES,
          name: "png, avif, webp, jpeg, jpg"
        } ],
        properties: [ "openFile" ]
      }).then(result => {
        result.filePaths[0] && (this.avatarImgPath = result.filePaths[0]);
      });
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  const options = "function" == typeof script ? script.options : script;
  let hook;
  if (template && template.render && (options.render = template.render, options.staticRenderFns = template.staticRenderFns, 
  options._compiled = !0), scopeId && (options._scopeId = scopeId), style && (hook = function(context) {
    style.call(this, createInjector(context));
  }), hook) if (options.functional) {
    const originalRender = options.render;
    options.render = function(h, context) {
      return hook.call(context), originalRender(h, context);
    };
  } else {
    const existing = options.beforeCreate;
    options.beforeCreate = existing ? [].concat(existing, hook) : [ hook ];
  }
  return script;
}

const isOldIE = "undefined" != typeof navigator && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

function createInjector(context) {
  return (id, style) => function(id, css) {
    const group = isOldIE ? css.media || "default" : id, style = styles[group] || (styles[group] = {
      ids: new Set,
      styles: []
    });
    if (!style.ids.has(id)) {
      style.ids.add(id);
      let code = css.source;
      if (css.map && (code += "\n/*# sourceURL=" + css.map.sources[0] + " */", code += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + " */"), 
      style.element || (style.element = document.createElement("style"), style.element.type = "text/css", 
      css.media && style.element.setAttribute("media", css.media), void 0 === HEAD && (HEAD = document.head || document.getElementsByTagName("head")[0]), 
      HEAD.appendChild(style.element)), "styleSheet" in style.element) style.styles.push(code), 
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join("\n"); else {
        const index = style.ids.size - 1, textNode = document.createTextNode(code), nodes = style.element.childNodes;
        nodes[index] && style.element.removeChild(nodes[index]), nodes.length ? style.element.insertBefore(textNode, nodes[index]) : style.element.appendChild(textNode);
      }
    }
  }(id, style);
}

let HEAD;

const styles = {};

const __vue_component__$a = normalizeComponent({
  render: function() {
    var _vm = this, _h = _vm.$createElement, _c = _vm._self._c || _h;
    return _c("div", {
      staticClass: "new-author"
    }, [ _c("div", {
      staticClass: "horizontal-item"
    }, [ _c("div", {
      staticStyle: {
        width: "40%",
        margin: "0 auto"
      }
    }, [ _c("div", {
      staticClass: "avatar",
      on: {
        click: _vm.addAvatarImg
      }
    }, [ this.avatarImgPath ? _c("div", [ _c("img", {
      staticClass: "img",
      attrs: {
        src: this.avatarImgPath,
        alt: "img"
      }
    }) ]) : _c("div", [ _c("i", {
      staticClass: "fas fa-images fa-9x",
      staticStyle: {
        margin: "20px 8px"
      }
    }) ]) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "58%"
      }
    }, [ _c("div", {
      staticStyle: {
        width: "100%",
        height: "100%"
      }
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.authors.name"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.authors.name.desc"))) ]), _vm._v(" "), _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.newAuthor.name,
        expression: "newAuthor['name']",
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "input",
      attrs: {
        type: "text",
        placeholder: _vm.tl("menu.ysm_utils.required_fields")
      },
      domProps: {
        value: _vm.newAuthor.name
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.newAuthor, "name", $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "100%",
        height: "100%",
        "margin-top": "10px"
      }
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.authors.role"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.authors.role.desc"))) ]), _vm._v(" "), _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.newAuthor.role,
        expression: "newAuthor['role']",
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "input",
      attrs: {
        type: "text",
        placeholder: _vm.tl("menu.ysm_utils.can_be_empty")
      },
      domProps: {
        value: _vm.newAuthor.role
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.newAuthor, "role", $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }) ]) ]) ]), _vm._v(" "), _c("div", {
      staticClass: "new-author-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.authors.comment"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.authors.comment.desc"))) ]), _vm._v(" "), _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.newAuthor.comment,
        expression: "newAuthor['comment']",
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "input",
      attrs: {
        type: "text",
        placeholder: _vm.tl("menu.ysm_utils.can_be_empty")
      },
      domProps: {
        value: _vm.newAuthor.comment
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.newAuthor, "comment", $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }) ]), _vm._v(" "), _c("div", {
      staticClass: "new-author-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.authors.contact"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.authors.contact.desc"))) ]), _vm._v(" "), _vm._l(_vm.tmpContact, function(value, index) {
      return _c("div", [ _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model",
          value: value[0],
          expression: "value[0]"
        } ],
        staticClass: "input-contact-type",
        attrs: {
          type: "text"
        },
        domProps: {
          value: value[0]
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(value, 0, $event.target.value);
          }
        }
      }), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: value[1],
          expression: "value[1]",
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "input-contact",
        attrs: {
          type: "text"
        },
        domProps: {
          value: value[1]
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(value, 1, $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }), _vm._v(" "), _c("button", {
        staticStyle: {
          width: "6%",
          "min-width": "5%",
          padding: "0"
        },
        on: {
          click: function($event) {
            return _vm.deleteContact(index);
          }
        }
      }, [ _c("i", {
        staticClass: "fas fa-trash-alt",
        staticStyle: {
          margin: "0 auto 3px"
        }
      }) ]) ]);
    }), _vm._v(" "), _c("button", {
      staticStyle: {
        width: "100%",
        "margin-top": "5px"
      },
      on: {
        click: function($event) {
          return _vm.addNewContact();
        }
      }
    }, [ _vm._v("\n            " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.authors.contact.add")) + "\n        ") ]) ], 2), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "100%",
        "margin-top": "10px"
      }
    }, [ _vm.isEditAction ? _c("div", [ _c("button", {
      staticStyle: {
        width: "48.5%"
      },
      on: {
        click: _vm.deleteAuthor
      }
    }, [ _vm._v("\n                " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.authors.delete")) + "\n            ") ]), _vm._v(" "), _c("button", {
      staticStyle: {
        width: "48.5%",
        "margin-left": "2%"
      },
      on: {
        click: _vm.addAuthor
      }
    }, [ _vm._v("\n                " + _vm._s(_vm.tl("dialog.confirm")) + "\n            ") ]) ]) : _c("div", [ _c("button", {
      staticStyle: {
        width: "100%"
      },
      on: {
        click: _vm.addAuthor
      }
    }, [ _vm._v("\n                " + _vm._s(_vm.tl("dialog.confirm")) + "\n            ") ]) ]) ]) ]);
  },
  staticRenderFns: []
}, function(inject) {
  inject && inject("data-v-106c6288_0", {
    source: ".new-author[data-v-106c6288]{width:100%;overflow-y:auto;padding:10px 20px}.new-author-item[data-v-106c6288]{height:100%;width:100%;margin-top:10px}.title[data-v-106c6288]{margin:0;padding:0;font-size:large}.desc[data-v-106c6288]{margin:0;padding:0;color:#6a6a6d}.input[data-v-106c6288]{border-radius:1px;margin-top:5px;padding:2px 2px 2px 5px;width:100%;height:30px;font-size:15px;background-color:#1c2026;border-style:solid;border-width:1px;border-color:#181a1f}.input-contact-type[data-v-106c6288]{border-radius:1px;margin-top:5px;padding:2px 2px 2px 5px;width:17%;height:30px;font-size:15px;background-color:#1c2026;border-style:solid;border-width:1px;border-color:#181a1f}.input-contact[data-v-106c6288]{border-radius:1px;margin-top:5px;padding:2px 2px 2px 5px;width:75%;height:30px;font-size:15px;background-color:#1c2026;border-style:solid;border-width:1px;border-color:#181a1f}.img[data-v-106c6288]{width:180px;height:180px}.avatar[data-v-106c6288]{padding:10px;background-color:#1c2026;width:200px;height:200px}.avatar[data-v-106c6288]:hover{padding:10px;background-color:#396fd6;width:200px;height:200px}.horizontal-item[data-v-106c6288]{height:100%;width:100%;display:flex;align-items:center}",
    map: void 0,
    media: void 0
  });
}, script$a, "data-v-106c6288", 0, 0, 0, createInjector);

var script$9 = {
  props: {
    importModelMenuDialog: {
      type: Object,
      required: !0
    },
    ysmJson: {
      type: Object,
      required: !0
    },
    packDirectory: {
      type: Object,
      required: !0
    }
  },
  data: () => ({}),
  methods: {
    join: path.join,
    tl: tl,
    resizeTextarea() {
      const textarea = this.$refs.textarea;
      textarea.style.height = "auto", textarea.style.height = textarea.scrollHeight + "px";
    },
    openNewAuthorDialog: function() {
      !function(ysmJson, packDirectory) {
        let newAuthorDialog = new Dialog({
          title: "menu.ysm_utils.load_info_menu.metadata.authors.new",
          cancel_on_click_outside: !1,
          width: 600,
          singleButton: !0,
          component: {
            data: () => ({
              authorDialog: newAuthorDialog,
              authors: ysmJson.metadata.authors,
              packDirectory: packDirectory
            }),
            components: {
              newAuthorVue: __vue_component__$a
            },
            template: '\n                <div>\n                    <newAuthorVue :new-author-dialog="authorDialog"\n                                  :authors="authors"\n                                  :author-index=-1\n                                  :pack-directory=\'packDirectory\'/>\n                </div>'
          }
        });
        newAuthorDialog.show();
      }(this.ysmJson, this.packDirectory);
    },
    editAuthorDialog: function(editAuthor, index) {
      let copyEditAuthor = JSON.parse(JSON.stringify(editAuthor));
      !function(ysmJson, packDirectory, editAuthor, index) {
        let newAuthorDialog = new Dialog({
          title: "menu.ysm_utils.load_info_menu.metadata.authors.edit",
          cancel_on_click_outside: !1,
          width: 600,
          singleButton: !0,
          component: {
            data: () => ({
              authorDialog: newAuthorDialog,
              authors: ysmJson.metadata.authors,
              editAuthor: editAuthor,
              packDirectory: packDirectory,
              index: index
            }),
            components: {
              newAuthorVue: __vue_component__$a
            },
            template: '\n                <div>\n                    <newAuthorVue :new-author-dialog="authorDialog"\n                                  :authors="authors" :new-author="editAuthor"\n                                  :author-index=index\n                                  :pack-directory=\'packDirectory\'/>\n                </div>'
          }
        });
        newAuthorDialog.show();
      }(this.ysmJson, this.packDirectory, copyEditAuthor, index);
    }
  },
  computed: {
    metadata: function() {
      return this.ysmJson.metadata;
    },
    license: function() {
      return this.metadata.license;
    },
    link: function() {
      return this.metadata.link;
    }
  }
};

const __vue_component__$9 = normalizeComponent({
  render: function() {
    var _vm = this, _h = _vm.$createElement, _c = _vm._self._c || _h;
    return _c("div", {
      staticClass: "metadata"
    }, [ _c("div", {
      staticClass: "metadata-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.name"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.name.desc"))) ]), _vm._v(" "), _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.metadata.name,
        expression: "metadata['name']",
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "input",
      attrs: {
        type: "text",
        placeholder: _vm.tl("menu.ysm_utils.required_fields")
      },
      domProps: {
        value: _vm.metadata.name
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.metadata, "name", $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }) ]), _vm._v(" "), _c("div", {
      staticClass: "metadata-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.tips"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.tips.desc"))) ]), _vm._v(" "), _c("textarea", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.metadata.tips,
        expression: "metadata['tips']",
        modifiers: {
          trim: !0
        }
      } ],
      ref: "textarea",
      staticClass: "textarea",
      attrs: {
        placeholder: _vm.tl("menu.ysm_utils.can_be_empty")
      },
      domProps: {
        value: _vm.metadata.tips
      },
      on: {
        input: [ function($event) {
          $event.target.composing || _vm.$set(_vm.metadata, "tips", $event.target.value.trim());
        }, _vm.resizeTextarea ],
        click: _vm.resizeTextarea,
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }) ]), _vm._v(" "), _c("div", {
      staticClass: "metadata-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.license"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.license.desc"))) ]), _vm._v(" "), _c("div", {
      staticClass: "horizontal-item"
    }, [ _c("p", {
      staticClass: "horizontal-text"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.license.type"))) ]), _vm._v(" "), _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.license.type,
        expression: "license['type']",
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "horizontal-input",
      attrs: {
        type: "text",
        placeholder: _vm.tl("menu.ysm_utils.suggest")
      },
      domProps: {
        value: _vm.license.type
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.license, "type", $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }) ]), _vm._v(" "), _c("div", {
      staticClass: "horizontal-item"
    }, [ _c("p", {
      staticClass: "horizontal-text"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.license.extra_desc"))) ]), _vm._v(" "), _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.license.desc,
        expression: "license['desc']",
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "horizontal-input",
      attrs: {
        type: "text",
        placeholder: _vm.tl("menu.ysm_utils.can_be_empty")
      },
      domProps: {
        value: _vm.license.desc
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.license, "desc", $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }) ]) ]), _vm._v(" "), _c("div", {
      staticClass: "metadata-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.authors"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.authors.desc"))) ]), _vm._v(" "), _c("div", {
      staticClass: "author"
    }, [ _vm._l(_vm.metadata.authors, function(author, index) {
      return _c("div", {
        staticClass: "author-item"
      }, [ _c("button", {
        staticClass: "author-config-button",
        on: {
          click: function($event) {
            return _vm.editAuthorDialog(author, index);
          }
        }
      }, [ _c("i", {
        staticClass: "fa-regular fa-pen-to-square",
        staticStyle: {
          "vertical-align": "middle"
        }
      }), _vm._v(" "), _c("span", [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.authors.config"))) ]) ]), _vm._v(" "), author.avatar ? _c("div", {
        staticClass: "avatar"
      }, [ _c("img", {
        attrs: {
          src: _vm.join(_vm.packDirectory, author.avatar),
          alt: "avatar",
          width: "76px"
        }
      }) ]) : _c("div", {
        staticStyle: {
          display: "flex",
          "align-items": "center",
          height: "90px"
        }
      }, [ _c("i", {
        staticClass: "fa-solid fa-image fa-4x",
        staticStyle: {
          margin: "0 auto"
        }
      }) ]), _vm._v(" "), _c("p", {
        staticClass: "author-name"
      }, [ _vm._v(_vm._s(author.name)) ]), _vm._v(" "), _c("p", {
        staticClass: "author-role"
      }, [ _vm._v(_vm._s(author.role)) ]), _vm._v(" "), _c("p", {
        staticClass: "author-comment"
      }, [ _vm._v(_vm._s(author.comment)) ]) ]);
    }), _vm._v(" "), _c("div", {
      staticClass: "author-item"
    }, [ _c("div", {
      staticClass: "author-add",
      on: {
        click: _vm.openNewAuthorDialog
      }
    }, [ _c("i", {
      staticClass: "fa-solid fa-plus fa-4x",
      staticStyle: {
        margin: "0 auto"
      }
    }) ]) ]) ], 2) ]), _vm._v(" "), _c("div", {
      staticClass: "metadata-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.link"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.link.desc"))) ]), _vm._v(" "), _c("div", {
      staticClass: "horizontal-item"
    }, [ _c("p", {
      staticClass: "horizontal-text"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.link.home"))) ]), _vm._v(" "), _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.link.home,
        expression: "link['home']",
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "horizontal-input",
      attrs: {
        type: "url",
        placeholder: _vm.tl("menu.ysm_utils.suggest")
      },
      domProps: {
        value: _vm.link.home
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.link, "home", $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }) ]), _vm._v(" "), _c("div", {
      staticClass: "horizontal-item"
    }, [ _c("p", {
      staticClass: "horizontal-text"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.metadata.link.donate"))) ]), _vm._v(" "), _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.link.donate,
        expression: "link['donate']",
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "horizontal-input",
      attrs: {
        type: "url",
        placeholder: _vm.tl("menu.ysm_utils.suggest")
      },
      domProps: {
        value: _vm.link.donate
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.link, "donate", $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }) ]) ]) ]);
  },
  staticRenderFns: []
}, function(inject) {
  inject && inject("data-v-e229d502_0", {
    source: ".author[data-v-e229d502]{display:flex;margin-top:10px;flex-wrap:wrap}.author-item[data-v-e229d502]{width:135px;min-height:200px;text-align:center;margin-top:5px;margin-left:5px;padding:5px;background-color:#1e1e22;border-style:solid;border-width:1px;border-color:#181a1f}.author-name[data-v-e229d502]{color:#b4b4b4;font-size:small}.author-role[data-v-e229d502]{color:#769f16;font-size:small}.author-comment[data-v-e229d502]{color:#6a6a6d;font-size:small}.author-config-button[data-v-e229d502]{width:100%;margin-bottom:10px}.author-add[data-v-e229d502]{width:100%;height:100%;padding:5px;background-color:#272727;display:flex;align-items:center}.author-add[data-v-e229d502]:hover{width:100%;height:100%;padding:5px;background-color:#396fd6;display:flex;align-items:center}.avatar[data-v-e229d502]{margin:0 auto;background-color:#3e3e3e;border-style:solid;border-width:2px;border-color:#181a1f;width:80px;height:80px}.metadata[data-v-e229d502]{width:100%;overflow-y:auto;padding:10px 20px}.metadata-item[data-v-e229d502]{height:100%;width:100%;margin-top:10px}.title[data-v-e229d502]{margin:0;padding:0;font-size:large}.desc[data-v-e229d502]{margin:0;padding:0;color:#6a6a6d}.input[data-v-e229d502]{border-radius:1px;margin-top:5px;padding:2px 2px 2px 5px;width:100%;height:30px;font-size:15px;background-color:#1c2026;border-style:solid;border-width:1px;border-color:#181a1f}.horizontal-item[data-v-e229d502]{display:flex}.horizontal-text[data-v-e229d502]{width:12%;margin-top:7px;font-size:15px;color:#6a6a6d}.horizontal-input[data-v-e229d502]{flex:1;border-radius:1px;margin-top:5px;padding:2px 2px 2px 5px;height:30px;font-size:15px;background-color:#1c2026;border-style:solid;border-width:1px;border-color:#181a1f}.textarea[data-v-e229d502]{border-radius:1px;margin-top:5px;padding:2px 2px 2px 5px;width:100%;font-size:15px;background-color:#1c2026;border-style:solid;border-width:1px;border-color:#181a1f}",
    map: void 0,
    media: void 0
  });
}, script$9, "data-v-e229d502", 0, 0, 0, createInjector);

var script$8 = {
  props: {
    editExtraAnimationDialog: {
      type: Object,
      required: !0
    },
    ysmJson: {
      type: Object,
      required: !0
    },
    packDirectory: {
      type: Object,
      required: !0
    },
    index: {
      type: Number,
      required: !0
    }
  },
  beforeMount() {
    this.isExtraAnimationClassify && this.switchToExtraAnimationClassify(), this.hasConfig && this.switchToHasConfig();
  },
  data: () => ({
    keyType: "extra_animation",
    valueType: "no_config"
  }),
  methods: {
    join: path.join,
    tl: tl,
    switchToExtraAnimation: function() {
      this.keyType = "extra_animation";
    },
    switchToExtraAnimationClassify: function() {
      this.keyType = "extra_animation_classify";
    },
    switchToNoConfig: function() {
      this.valueType = "no_config";
    },
    switchToHasConfig: function() {
      this.valueType = "has_config";
    },
    getAvailableExtraAnimation: function() {
      let output = new Set, existExtraAnimations = Object.keys(this.properties.extra_animation ?? {});
      return this.allExtraAnimations.forEach(name => {
        existExtraAnimations.includes(name) || output.add(name);
      }), output;
    },
    getAvailableExtraAnimationClassify: function() {
      let output = new Set;
      return (this.properties.extra_animation_classify ?? []).forEach(value => {
        value.id && output.add("#" + value.id);
      }), output;
    },
    getAvailableConfig: function() {
      let output = new Set;
      return (this.properties.extra_animation_buttons ?? []).forEach(value => {
        value.id && output.add("#" + value.id);
      }), output;
    },
    onSaveExtraAnimations: function() {
      let tmp = {};
      for (let value of this.tmpExtraAnimation) tmp[value[0]] = value[1];
      this.properties.extra_animation = tmp, this.editExtraAnimationDialog.close();
    }
  },
  computed: {
    properties: function() {
      return this.ysmJson.properties;
    },
    tmpExtraAnimation: function() {
      let output = [];
      for (let key in this.properties.extra_animation) output.push([ key, this.properties.extra_animation[key] ]);
      return output;
    },
    isExtraAnimationClassify: function() {
      return this.tmpExtraAnimation[this.index][0].startsWith("#");
    },
    hasConfig: function() {
      return this.tmpExtraAnimation[this.index][1].startsWith("#");
    },
    allExtraAnimations: function() {
      let keys = new Set;
      for (let i = 0; i < 8; i++) keys.add(`extra${i}`);
      let extraAnimationFile = this.ysmJson?.files.player.animation.extra;
      if (extraAnimationFile) {
        let filePath = path.join(this.packDirectory, extraAnimationFile);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          let content = fs.readFileSync(filePath, "utf8"), animations = autoParseJSON(content).animations ?? {};
          Object.keys(animations).forEach(name => keys.add(name));
        }
      }
      return keys;
    }
  }
};

const __vue_component__$8 = normalizeComponent({
  render: function() {
    var _vm = this, _h = _vm.$createElement, _c = _vm._self._c || _h;
    return _c("div", {
      staticClass: "properties"
    }, [ _c("div", {
      staticClass: "all-item"
    }, [ _c("div", {
      staticClass: "properties-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.key"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.key.desc"))) ]), _vm._v(" "), _c("div", {
      staticClass: "horizontal-item",
      staticStyle: {
        "margin-bottom": "5px"
      }
    }, [ _c("div", {
      staticStyle: {
        width: "50%"
      }
    }, [ _c("input", {
      attrs: {
        type: "radio",
        name: "extra_animation_type"
      },
      domProps: {
        checked: !_vm.isExtraAnimationClassify
      },
      on: {
        click: _vm.switchToExtraAnimation
      }
    }), _vm._v(" "), _c("label", [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation"))) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "50%"
      }
    }, [ _c("input", {
      attrs: {
        type: "radio",
        name: "extra_animation_type"
      },
      domProps: {
        checked: _vm.isExtraAnimationClassify
      },
      on: {
        click: _vm.switchToExtraAnimationClassify
      }
    }), _vm._v(" "), _c("label", [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_classify"))) ]) ]) ]), _vm._v(" "), "extra_animation" === _vm.keyType ? _c("div", [ _c("select", {
      directives: [ {
        name: "model",
        rawName: "v-model",
        value: _vm.tmpExtraAnimation[_vm.index][0],
        expression: "tmpExtraAnimation[index][0]"
      } ],
      staticStyle: {
        width: "100%",
        "text-align": "center",
        "margin-top": "5px"
      },
      on: {
        change: function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected;
          }).map(function(o) {
            return "_value" in o ? o._value : o.value;
          });
          _vm.$set(_vm.tmpExtraAnimation[_vm.index], 0, $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }
      }
    }, [ _c("option", {
      attrs: {
        selected: ""
      }
    }, [ _vm._v(_vm._s(_vm.tmpExtraAnimation[_vm.index][0])) ]), _vm._v(" "), _vm._l(_vm.getAvailableExtraAnimation(), function(name) {
      return _c("option", [ _vm._v(_vm._s(name)) ]);
    }) ], 2) ]) : _vm._e(), _vm._v(" "), "extra_animation_classify" === _vm.keyType ? _c("div", [ _c("select", {
      directives: [ {
        name: "model",
        rawName: "v-model",
        value: _vm.tmpExtraAnimation[_vm.index][0],
        expression: "tmpExtraAnimation[index][0]"
      } ],
      staticStyle: {
        width: "100%",
        "text-align": "center",
        "margin-top": "5px"
      },
      on: {
        change: function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected;
          }).map(function(o) {
            return "_value" in o ? o._value : o.value;
          });
          _vm.$set(_vm.tmpExtraAnimation[_vm.index], 0, $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }
      }
    }, [ _c("option", {
      attrs: {
        selected: ""
      }
    }, [ _vm._v(_vm._s(_vm.tmpExtraAnimation[_vm.index][0])) ]), _vm._v(" "), _vm._l(_vm.getAvailableExtraAnimationClassify(), function(value) {
      return _c("option", [ _vm._v(_vm._s(value)) ]);
    }) ], 2) ]) : _vm._e() ]), _vm._v(" "), _c("div", {
      staticClass: "properties-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.value"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.value.desc"))) ]), _vm._v(" "), _c("div", {
      staticClass: "horizontal-item",
      staticStyle: {
        "margin-bottom": "5px"
      }
    }, [ _c("div", {
      staticStyle: {
        width: "50%"
      }
    }, [ _c("input", {
      attrs: {
        type: "radio",
        name: "extra_animation_config"
      },
      domProps: {
        checked: !_vm.hasConfig
      },
      on: {
        click: _vm.switchToNoConfig
      }
    }), _vm._v(" "), _c("label", [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.no_config"))) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "50%"
      }
    }, [ _c("input", {
      attrs: {
        type: "radio",
        name: "extra_animation_config"
      },
      domProps: {
        checked: _vm.hasConfig
      },
      on: {
        click: _vm.switchToHasConfig
      }
    }), _vm._v(" "), _c("label", [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.has_config"))) ]) ]) ]), _vm._v(" "), "no_config" === _vm.valueType ? _c("div", [ _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.tmpExtraAnimation[_vm.index][1],
        expression: "tmpExtraAnimation[index][1]",
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "input",
      attrs: {
        type: "text"
      },
      domProps: {
        value: _vm.tmpExtraAnimation[_vm.index][1]
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.tmpExtraAnimation[_vm.index], 1, $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }) ]) : _vm._e(), _vm._v(" "), "has_config" === _vm.valueType ? _c("div", [ _c("select", {
      directives: [ {
        name: "model",
        rawName: "v-model",
        value: _vm.tmpExtraAnimation[_vm.index][1],
        expression: "tmpExtraAnimation[index][1]"
      } ],
      staticStyle: {
        width: "100%",
        "text-align": "center",
        "margin-top": "5px"
      },
      on: {
        change: function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected;
          }).map(function(o) {
            return "_value" in o ? o._value : o.value;
          });
          _vm.$set(_vm.tmpExtraAnimation[_vm.index], 1, $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }
      }
    }, [ _c("option", {
      attrs: {
        selected: ""
      }
    }, [ _vm._v(_vm._s(_vm.tmpExtraAnimation[_vm.index][1])) ]), _vm._v(" "), _vm._l(_vm.getAvailableConfig(), function(value) {
      return _c("option", [ _vm._v(_vm._s(value)) ]);
    }) ], 2) ]) : _vm._e() ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        "margin-top": "20px",
        "margin-bottom": "10px"
      }
    }, [ _c("button", {
      staticStyle: {
        width: "100%"
      },
      on: {
        click: _vm.onSaveExtraAnimations
      }
    }, [ _vm._v(_vm._s(_vm.tl("dialog.confirm"))) ]) ]) ]);
  },
  staticRenderFns: []
}, function(inject) {
  inject && inject("data-v-c6df572c_0", {
    source: ".properties[data-v-c6df572c]{width:100%;overflow-y:auto;padding:10px 20px}.properties-item[data-v-c6df572c]{height:100%;width:100%;margin-top:10px;margin-bottom:20px}.horizontal-item[data-v-c6df572c]{height:100%;width:100%;margin-top:10px;display:flex;align-items:center}.all-item[data-v-c6df572c]{padding:20px 30px 20px 30px;border-radius:2px;border-style:solid;border-width:1px;border-color:rgb(24,26,31,.5);box-shadow:0 2px 12px 0 rgba(0,0,0,.3)}.title[data-v-c6df572c]{margin:0;padding:0;font-size:large}.desc[data-v-c6df572c]{margin:0;padding:0;color:#6a6a6d}.input[data-v-c6df572c]{border-radius:1px;margin-top:5px;padding:2px 2px 2px 5px;width:100%;height:30px;font-size:15px;background-color:#1c2026;border-style:solid;border-width:1px;border-color:#181a1f}",
    map: void 0,
    media: void 0
  });
}, script$8, "data-v-c6df572c", 0, 0, 0, createInjector);

var script$7 = {
  props: {
    editExtraAnimationClassifyDialog: {
      type: Object,
      required: !0
    },
    ysmJson: {
      type: Object,
      required: !0
    },
    packDirectory: {
      type: Object,
      required: !0
    },
    index: {
      type: Number,
      required: !0
    }
  },
  beforeMount() {},
  data: () => ({}),
  methods: {
    join: path.join,
    tl: tl,
    shouldAddLine: function(index, listSize) {
      return 0 !== index && (index !== listSize - 2 ? index % 8 == 6 : void 0);
    },
    deleteExtraAnimation: function(index) {
      this.tmpExtraAnimation.splice(index, 1), this.updateExtraAnimation(), this.$forceUpdate();
    },
    addNewExtraAnimation: function() {
      this.tmpExtraAnimation.push([ "", "" ]), this.$forceUpdate();
    },
    updateExtraAnimation: function() {
      let tmp = {};
      for (let value of this.tmpExtraAnimation) tmp[value[0]] = value[1];
      this.properties.extra_animation_classify[this.index].extra_animation = tmp;
    },
    editExtraAnimation: function(index) {
      this.updateExtraAnimation(), function(ysmJson, packDirectory, index, indexInClassify) {
        let editExtraAnimationInClassifyDialog = new Dialog({
          title: "menu.ysm_utils.load_info_menu.properties.extra_animation",
          cancel_on_click_outside: !1,
          width: 800,
          singleButton: !0,
          component: {
            data: () => ({
              editExtraAnimationInClassifyDialog: editExtraAnimationInClassifyDialog,
              ysmJson: ysmJson,
              packDirectory: packDirectory,
              index: index,
              indexInClassify: indexInClassify
            }),
            components: {
              extraAnimationInClassifyVue: __vue_component__$6
            },
            template: '\n                <div>\n                    <extraAnimationInClassifyVue\n                        :edit-extra-animation-dialog="editExtraAnimationInClassifyDialog"\n                        :ysm-json="ysmJson" :index="index" :index-in-classify="indexInClassify"\n                        :pack-directory=\'packDirectory\'/>\n                </div>'
          }
        });
        editExtraAnimationInClassifyDialog.show();
      }(this.ysmJson, this.packDirectory, index, this.index);
    },
    onSaveExtraAnimations: function() {
      let tmp = {};
      for (let value of this.tmpExtraAnimation) tmp[value[0]] = value[1];
      this.properties.extra_animation_classify[this.index].extra_animation = tmp, this.editExtraAnimationClassifyDialog.close();
    }
  },
  computed: {
    properties: function() {
      return this.ysmJson.properties;
    },
    extraAnimations: function() {
      return this.properties.extra_animation_classify[this.index].extra_animation;
    },
    tmpExtraAnimation: function() {
      let output = [];
      for (let key in this.extraAnimations) output.push([ key, this.extraAnimations[key] ]);
      return output;
    }
  }
};

const __vue_component__$7 = normalizeComponent({
  render: function() {
    var _vm = this, _h = _vm.$createElement, _c = _vm._self._c || _h;
    return _c("div", {
      staticClass: "properties"
    }, [ _c("div", {
      staticClass: "all-item"
    }, [ _c("div", {
      staticClass: "properties-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_classify.id"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_classify.id.desc"))) ]), _vm._v(" "), _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.properties.extra_animation_classify[_vm.index].id,
        expression: 'properties["extra_animation_classify"][index]["id"]',
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "input",
      attrs: {
        type: "text",
        placeholder: _vm.tl("menu.ysm_utils.required_fields")
      },
      domProps: {
        value: _vm.properties.extra_animation_classify[_vm.index].id
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.properties.extra_animation_classify[_vm.index], "id", $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }) ]), _vm._v(" "), _c("div", {
      staticClass: "properties-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_classify"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_classify.desc"))) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        display: "flex",
        "flex-wrap": "wrap",
        "margin-top": "10px"
      }
    }, [ _vm._l(_vm.tmpExtraAnimation, function(value, index) {
      return _c("div", {
        staticStyle: {
          width: "49%",
          "margin-left": "2px",
          "margin-top": "2px",
          overflow: "visible"
        }
      }, [ _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: value[0],
          expression: "value[0]",
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "input",
        staticStyle: {
          width: "30%",
          "margin-left": "2px"
        },
        attrs: {
          type: "text",
          disabled: ""
        },
        domProps: {
          value: value[0]
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(value, 0, $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: value[1],
          expression: "value[1]",
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "input",
        staticStyle: {
          width: "40%",
          "margin-left": "2px"
        },
        attrs: {
          type: "text",
          disabled: ""
        },
        domProps: {
          value: value[1]
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(value, 1, $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }), _vm._v(" "), _c("i", {
        staticClass: "fa-solid fa-pen-to-square extra-delete",
        on: {
          click: function($event) {
            return _vm.editExtraAnimation(index);
          }
        }
      }), _vm._v(" "), _c("i", {
        staticClass: "fa-solid fa-trash-can extra-delete",
        on: {
          click: function($event) {
            return _vm.deleteExtraAnimation(index);
          }
        }
      }), _vm._v(" "), _vm.shouldAddLine(index, _vm.tmpExtraAnimation.length) ? _c("hr", {
        staticStyle: {
          width: "192.5%",
          "border-top": "3px dashed #1e1e22"
        }
      }) : _vm._e() ]);
    }), _vm._v(" "), _c("button", {
      staticStyle: {
        width: "44.8%",
        "margin-left": "2px",
        "margin-top": "2px"
      },
      on: {
        click: function($event) {
          return _vm.addNewExtraAnimation();
        }
      }
    }, [ _c("i", {
      staticClass: "fa-solid fa-plus",
      staticStyle: {
        "vertical-align": "middle"
      }
    }), _vm._v(" "), _c("span", [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.add"))) ]) ]) ], 2) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        "margin-top": "20px",
        "margin-bottom": "10px"
      }
    }, [ _c("button", {
      staticStyle: {
        width: "100%"
      },
      on: {
        click: _vm.onSaveExtraAnimations
      }
    }, [ _vm._v(_vm._s(_vm.tl("dialog.confirm"))) ]) ]) ]);
  },
  staticRenderFns: []
}, function(inject) {
  inject && inject("data-v-4aa5088c_0", {
    source: ".properties[data-v-4aa5088c]{width:100%;overflow-y:auto;padding:10px 20px}.properties-item[data-v-4aa5088c]{height:100%;width:100%;margin-top:10px;margin-bottom:20px}.title[data-v-4aa5088c]{margin:0;padding:0;font-size:large}.desc[data-v-4aa5088c]{margin:0;padding:0;color:#6a6a6d}.horizontal-item[data-v-4aa5088c]{height:100%;width:100%;margin-top:10px;display:flex;align-items:center}.all-item[data-v-4aa5088c]{padding:20px 30px 20px 30px;border-radius:2px;border-style:solid;border-width:1px;border-color:rgb(24,26,31,.5);box-shadow:0 2px 12px 0 rgba(0,0,0,.3)}.input[data-v-4aa5088c]{border-radius:1px;margin-top:5px;padding:2px 2px 2px 5px;width:100%;height:30px;font-size:15px;background-color:#1c2026;border-style:solid;border-width:1px;border-color:#181a1f}",
    map: void 0,
    media: void 0
  });
}, script$7, "data-v-4aa5088c", 0, 0, 0, createInjector);

var script$6 = {
  props: {
    editExtraAnimationDialog: {
      type: Object,
      required: !0
    },
    ysmJson: {
      type: Object,
      required: !0
    },
    packDirectory: {
      type: Object,
      required: !0
    },
    index: {
      type: Number,
      required: !0
    },
    indexInClassify: {
      type: Number,
      required: !0
    }
  },
  beforeMount() {
    this.isExtraAnimationClassify && this.switchToExtraAnimationClassify(), this.hasConfig && this.switchToHasConfig();
  },
  data: () => ({
    keyType: "extra_animation",
    valueType: "no_config"
  }),
  methods: {
    join: path.join,
    tl: tl,
    switchToExtraAnimation: function() {
      this.keyType = "extra_animation";
    },
    switchToExtraAnimationClassify: function() {
      this.keyType = "extra_animation_classify";
    },
    switchToNoConfig: function() {
      this.valueType = "no_config";
    },
    switchToHasConfig: function() {
      this.valueType = "has_config";
    },
    getAvailableExtraAnimation: function() {
      let output = new Set, existExtraAnimations = Object.keys(this.extraAnimations ?? {});
      return this.allExtraAnimations.forEach(name => {
        existExtraAnimations.includes(name) || output.add(name);
      }), output;
    },
    getAvailableExtraAnimationClassify: function() {
      let output = new Set;
      return (this.properties.extra_animation_classify ?? []).forEach(value => {
        value.id && output.add("#" + value.id);
      }), output;
    },
    getAvailableConfig: function() {
      let output = new Set;
      return (this.properties.extra_animation_buttons ?? []).forEach(value => {
        value.id && output.add("#" + value.id);
      }), output;
    },
    onSaveExtraAnimations: function() {
      let tmp = {};
      for (let value of this.tmpExtraAnimation) tmp[value[0]] = value[1];
      this.properties.extra_animation_classify[this.indexInClassify].extra_animation = tmp, 
      this.editExtraAnimationDialog.close();
    }
  },
  computed: {
    properties: function() {
      return this.ysmJson.properties;
    },
    extraAnimations: function() {
      return this.properties.extra_animation_classify[this.indexInClassify].extra_animation;
    },
    tmpExtraAnimation: function() {
      let output = [];
      for (let key in this.extraAnimations) output.push([ key, this.extraAnimations[key] ]);
      return output;
    },
    isExtraAnimationClassify: function() {
      return this.tmpExtraAnimation[this.index][0].startsWith("#");
    },
    hasConfig: function() {
      return this.tmpExtraAnimation[this.index][1].startsWith("#");
    },
    allExtraAnimations: function() {
      let keys = new Set;
      for (let i = 0; i < 8; i++) keys.add(`extra${i}`);
      let extraAnimationFile = this.ysmJson?.files.player.animation.extra;
      if (extraAnimationFile) {
        let filePath = path.join(this.packDirectory, extraAnimationFile);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          let content = fs.readFileSync(filePath, "utf8"), animations = autoParseJSON(content).animations ?? {};
          Object.keys(animations).forEach(name => keys.add(name));
        }
      }
      return keys;
    }
  }
};

const __vue_component__$6 = normalizeComponent({
  render: function() {
    var _vm = this, _h = _vm.$createElement, _c = _vm._self._c || _h;
    return _c("div", {
      staticClass: "properties"
    }, [ _c("div", {
      staticClass: "all-item"
    }, [ _c("div", {
      staticClass: "properties-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.key"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.key.desc"))) ]), _vm._v(" "), _c("div", {
      staticClass: "horizontal-item",
      staticStyle: {
        "margin-bottom": "5px"
      }
    }, [ _c("div", {
      staticStyle: {
        width: "50%"
      }
    }, [ _c("input", {
      attrs: {
        type: "radio",
        name: "extra_animation_type"
      },
      domProps: {
        checked: !_vm.isExtraAnimationClassify
      },
      on: {
        click: _vm.switchToExtraAnimation
      }
    }), _vm._v(" "), _c("label", [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation"))) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "50%"
      }
    }, [ _c("input", {
      attrs: {
        type: "radio",
        name: "extra_animation_type"
      },
      domProps: {
        checked: _vm.isExtraAnimationClassify
      },
      on: {
        click: _vm.switchToExtraAnimationClassify
      }
    }), _vm._v(" "), _c("label", [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_classify"))) ]) ]) ]), _vm._v(" "), "extra_animation" === _vm.keyType ? _c("div", [ _c("select", {
      directives: [ {
        name: "model",
        rawName: "v-model",
        value: _vm.tmpExtraAnimation[_vm.index][0],
        expression: "tmpExtraAnimation[index][0]"
      } ],
      staticStyle: {
        width: "100%",
        "text-align": "center",
        "margin-top": "5px"
      },
      on: {
        change: function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected;
          }).map(function(o) {
            return "_value" in o ? o._value : o.value;
          });
          _vm.$set(_vm.tmpExtraAnimation[_vm.index], 0, $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }
      }
    }, [ _c("option", {
      attrs: {
        selected: ""
      }
    }, [ _vm._v(_vm._s(_vm.tmpExtraAnimation[_vm.index][0])) ]), _vm._v(" "), _vm._l(_vm.getAvailableExtraAnimation(), function(name) {
      return _c("option", [ _vm._v(_vm._s(name)) ]);
    }) ], 2) ]) : _vm._e(), _vm._v(" "), "extra_animation_classify" === _vm.keyType ? _c("div", [ _c("select", {
      directives: [ {
        name: "model",
        rawName: "v-model",
        value: _vm.tmpExtraAnimation[_vm.index][0],
        expression: "tmpExtraAnimation[index][0]"
      } ],
      staticStyle: {
        width: "100%",
        "text-align": "center",
        "margin-top": "5px"
      },
      on: {
        change: function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected;
          }).map(function(o) {
            return "_value" in o ? o._value : o.value;
          });
          _vm.$set(_vm.tmpExtraAnimation[_vm.index], 0, $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }
      }
    }, [ _c("option", {
      attrs: {
        selected: ""
      }
    }, [ _vm._v(_vm._s(_vm.tmpExtraAnimation[_vm.index][0])) ]), _vm._v(" "), _vm._l(_vm.getAvailableExtraAnimationClassify(), function(value) {
      return _c("option", [ _vm._v(_vm._s(value)) ]);
    }) ], 2) ]) : _vm._e() ]), _vm._v(" "), _c("div", {
      staticClass: "properties-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.value"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.value.desc"))) ]), _vm._v(" "), _c("div", {
      staticClass: "horizontal-item",
      staticStyle: {
        "margin-bottom": "5px"
      }
    }, [ _c("div", {
      staticStyle: {
        width: "50%"
      }
    }, [ _c("input", {
      attrs: {
        type: "radio",
        name: "extra_animation_config"
      },
      domProps: {
        checked: !_vm.hasConfig
      },
      on: {
        click: _vm.switchToNoConfig
      }
    }), _vm._v(" "), _c("label", [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.no_config"))) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "50%"
      }
    }, [ _c("input", {
      attrs: {
        type: "radio",
        name: "extra_animation_config"
      },
      domProps: {
        checked: _vm.hasConfig
      },
      on: {
        click: _vm.switchToHasConfig
      }
    }), _vm._v(" "), _c("label", [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.has_config"))) ]) ]) ]), _vm._v(" "), "no_config" === _vm.valueType ? _c("div", [ _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.tmpExtraAnimation[_vm.index][1],
        expression: "tmpExtraAnimation[index][1]",
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "input",
      attrs: {
        type: "text"
      },
      domProps: {
        value: _vm.tmpExtraAnimation[_vm.index][1]
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.tmpExtraAnimation[_vm.index], 1, $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }) ]) : _vm._e(), _vm._v(" "), "has_config" === _vm.valueType ? _c("div", [ _c("select", {
      directives: [ {
        name: "model",
        rawName: "v-model",
        value: _vm.tmpExtraAnimation[_vm.index][1],
        expression: "tmpExtraAnimation[index][1]"
      } ],
      staticStyle: {
        width: "100%",
        "text-align": "center",
        "margin-top": "5px"
      },
      on: {
        change: function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected;
          }).map(function(o) {
            return "_value" in o ? o._value : o.value;
          });
          _vm.$set(_vm.tmpExtraAnimation[_vm.index], 1, $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }
      }
    }, [ _c("option", {
      attrs: {
        selected: ""
      }
    }, [ _vm._v(_vm._s(_vm.tmpExtraAnimation[_vm.index][1])) ]), _vm._v(" "), _vm._l(_vm.getAvailableConfig(), function(value) {
      return _c("option", [ _vm._v(_vm._s(value)) ]);
    }) ], 2) ]) : _vm._e() ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        "margin-top": "20px",
        "margin-bottom": "10px"
      }
    }, [ _c("button", {
      staticStyle: {
        width: "100%"
      },
      on: {
        click: _vm.onSaveExtraAnimations
      }
    }, [ _vm._v(_vm._s(_vm.tl("dialog.confirm"))) ]) ]) ]);
  },
  staticRenderFns: []
}, function(inject) {
  inject && inject("data-v-72820397_0", {
    source: ".properties[data-v-72820397]{width:100%;overflow-y:auto;padding:10px 20px}.properties-item[data-v-72820397]{height:100%;width:100%;margin-top:10px;margin-bottom:20px}.horizontal-item[data-v-72820397]{height:100%;width:100%;margin-top:10px;display:flex;align-items:center}.all-item[data-v-72820397]{padding:20px 30px 20px 30px;border-radius:2px;border-style:solid;border-width:1px;border-color:rgb(24,26,31,.5);box-shadow:0 2px 12px 0 rgba(0,0,0,.3)}.title[data-v-72820397]{margin:0;padding:0;font-size:large}.desc[data-v-72820397]{margin:0;padding:0;color:#6a6a6d}.input[data-v-72820397]{border-radius:1px;margin-top:5px;padding:2px 2px 2px 5px;width:100%;height:30px;font-size:15px;background-color:#1c2026;border-style:solid;border-width:1px;border-color:#181a1f}",
    map: void 0,
    media: void 0
  });
}, script$6, "data-v-72820397", 0, 0, 0, createInjector);

var script$5 = {
  props: {
    editExtraAnimationButtonsDialog: {
      type: Object,
      required: !0
    },
    ysmJson: {
      type: Object,
      required: !0
    },
    packDirectory: {
      type: Object,
      required: !0
    },
    index: {
      type: Number,
      required: !0
    }
  },
  beforeMount() {
    this.extraAnimationButtons.config_forms.forEach(form => {
      if ("radio" === form.type) {
        let tmpLabels = form.tmp_labels = [];
        Object.keys(form.labels).forEach(key => {
          let value = form.labels[key];
          tmpLabels.push([ key, value ]);
        });
      }
      form.uuid = crypto.randomUUID(), this.configForms.push(form);
    });
  },
  data() {
    return {
      form_type: [ "range", "checkbox", "radio" ],
      configForms: [],
      options: {
        handle: ".handle",
        animation: 100,
        onUpdate: this.onUpdateSort
      }
    };
  },
  methods: {
    join: path.join,
    tl: tl,
    onUpdateSort: function(event) {
      this.configForms.splice(event.newIndex, 0, this.configForms.splice(event.oldIndex, 1)[0]), 
      this.updateAllConfigForm(), this.$forceUpdate();
    },
    deleteNewConfigForm: function(formIndex) {
      Blockbench.showMessageBox({
        icon: "fa-warning",
        title: tl("level.ysm_utils.warning"),
        message: tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.delete"),
        width: 600,
        buttons: [ tl("dialog.confirm"), tl("dialog.cancel") ],
        confirm: 0,
        cancel: 1
      }, button => {
        0 === button && (this.configForms.splice(formIndex, 1), this.updateAllConfigForm(), 
        this.$forceUpdate());
      });
    },
    addNewConfigForm: function() {
      this.configForms.push({
        type: "checkbox",
        title: "",
        description: "",
        value: "",
        tmp_labels: [],
        uuid: crypto.randomUUID()
      }), this.updateAllConfigForm(), this.$forceUpdate();
    },
    deleteConfigFormLabels: function(formIndex, index) {
      this.configForms[formIndex].tmp_labels.splice(index, 1), this.updateSingleConfigForm(formIndex), 
      this.$forceUpdate();
    },
    addNewConfigFormLabels: function(formIndex) {
      this.configForms[formIndex].tmp_labels.push([ "", "" ]), this.updateSingleConfigForm(formIndex), 
      this.$forceUpdate();
    },
    updateSingleConfigForm: function(formIndex) {
      let tmp = {};
      for (let value of this.configForms[formIndex].tmp_labels) value[0] in tmp || (tmp[value[0]] = value[1]);
      this.configForms[formIndex].labels = tmp;
    },
    updateAllConfigForm: function() {
      let tmp = [];
      this.configForms.forEach((forms, index) => {
        forms.tmp_labels && this.updateSingleConfigForm(index), tmp.push(forms);
      }), this.extraAnimationButtons.config_forms = tmp;
    },
    onSaveExtraAnimationButtons: function(close) {
      this.updateAllConfigForm();
      let ysmJsonPath = path.join(this.packDirectory, "ysm.json");
      saveYsmFile(JSON.parse(JSON.stringify(this.ysmJson)), ysmJsonPath), close && this.editExtraAnimationButtonsDialog.close();
    }
  },
  computed: {
    properties: function() {
      return this.ysmJson.properties;
    },
    extraAnimationButtons: function() {
      return this.properties.extra_animation_buttons[this.index];
    }
  }
};

const __vue_component__$5 = normalizeComponent({
  render: function() {
    var _vm = this, _h = _vm.$createElement, _c = _vm._self._c || _h;
    return _c("div", {
      staticClass: "properties"
    }, [ _c("div", {
      staticClass: "all-item"
    }, [ _c("div", {
      staticClass: "properties-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.id"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.id.desc"))) ]), _vm._v(" "), _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.extraAnimationButtons.id,
        expression: 'extraAnimationButtons["id"]',
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "input",
      attrs: {
        type: "text",
        placeholder: _vm.tl("menu.ysm_utils.required_fields")
      },
      domProps: {
        value: _vm.extraAnimationButtons.id
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.extraAnimationButtons, "id", $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }) ]), _vm._v(" "), _c("div", {
      staticClass: "properties-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.name"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v("\n                " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.name.desc")) + "\n            ") ]), _vm._v(" "), _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.extraAnimationButtons.name,
        expression: 'extraAnimationButtons["name"]',
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "input",
      attrs: {
        type: "text",
        placeholder: _vm.tl("menu.ysm_utils.required_fields")
      },
      domProps: {
        value: _vm.extraAnimationButtons.name
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.extraAnimationButtons, "name", $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }) ]), _vm._v(" "), _c("div", {
      staticClass: "properties-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v("\n                " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms")) + "\n            ") ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v("\n                " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.desc")) + "\n            ") ]), _vm._v(" "), _c("ul", {
      directives: [ {
        name: "sortable",
        rawName: "v-sortable",
        value: _vm.options,
        expression: "options"
      } ],
      staticClass: "list-group"
    }, _vm._l(_vm.configForms, function(form, formIndex) {
      return _c("li", {
        key: form.uuid,
        staticClass: "list-group-item config_forms"
      }, [ _c("div", {
        staticClass: "container"
      }, [ _c("div", {
        staticClass: "right-align"
      }, [ _vm._m(0, !0), _vm._v(" "), _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            return _vm.deleteNewConfigForm(formIndex);
          }
        }
      }, [ _c("i", {
        staticClass: "fa-solid fa-trash-can"
      }) ]) ]) ]), _vm._v(" "), _c("div", {
        staticClass: "horizontal-item"
      }, [ _c("p", {
        staticClass: "horizontal-text"
      }, [ _vm._v("\n                            " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.type")) + "\n                        ") ]), _vm._v(" "), _c("select", {
        directives: [ {
          name: "model",
          rawName: "v-model",
          value: form.type,
          expression: "form['type']"
        } ],
        staticClass: "horizontal-option",
        on: {
          change: function($event) {
            var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
              return o.selected;
            }).map(function(o) {
              return "_value" in o ? o._value : o.value;
            });
            _vm.$set(form, "type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
          }
        }
      }, [ _c("option", {
        attrs: {
          selected: ""
        },
        domProps: {
          value: form.type
        }
      }, [ _vm._v("\n                                " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.type." + form.type)) + "\n                            ") ]), _vm._v(" "), _vm._l(_vm.form_type.filter(function(item) {
        return item !== form.type;
      }), function(type) {
        return _c("option", {
          domProps: {
            value: type
          }
        }, [ _vm._v("\n                                " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.type." + type)) + "\n                            ") ]);
      }) ], 2) ]), _vm._v(" "), _c("div", {
        staticClass: "horizontal-item"
      }, [ _c("p", {
        staticClass: "horizontal-text"
      }, [ _vm._v("\n                            " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.title")) + "\n                        ") ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: form.title,
          expression: 'form["title"]',
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "horizontal-input",
        attrs: {
          type: "text",
          placeholder: _vm.tl("menu.ysm_utils.required_fields")
        },
        domProps: {
          value: form.title
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(form, "title", $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }) ]), _vm._v(" "), _c("div", {
        staticClass: "horizontal-item"
      }, [ _c("p", {
        staticClass: "horizontal-text"
      }, [ _vm._v("\n                            " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.description")) + "\n                        ") ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: form.description,
          expression: 'form["description"]',
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "horizontal-input",
        attrs: {
          type: "text",
          placeholder: _vm.tl("menu.ysm_utils.required_fields")
        },
        domProps: {
          value: form.description
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(form, "description", $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }) ]), _vm._v(" "), _c("div", {
        staticClass: "horizontal-item"
      }, [ _c("p", {
        staticClass: "horizontal-text"
      }, [ _vm._v("\n                            " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.value")) + "\n                        ") ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: form.value,
          expression: 'form["value"]',
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "horizontal-input",
        attrs: {
          type: "text",
          placeholder: _vm.tl("menu.ysm_utils.required_fields")
        },
        domProps: {
          value: form.value
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(form, "value", $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }) ]), _vm._v(" "), "range" === form.type ? _c("div", {
        staticClass: "horizontal-item"
      }, [ _c("p", {
        staticClass: "horizontal-text"
      }, [ _vm._v("\n                            " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.step")) + "\n                        ") ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.number",
          value: form.step,
          expression: 'form["step"]',
          modifiers: {
            number: !0
          }
        } ],
        staticClass: "horizontal-input",
        attrs: {
          type: "text"
        },
        domProps: {
          value: form.step
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(form, "step", _vm._n($event.target.value));
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }) ]) : _vm._e(), _vm._v(" "), "range" === form.type ? _c("div", {
        staticClass: "horizontal-item"
      }, [ _c("p", {
        staticClass: "horizontal-text"
      }, [ _vm._v("\n                            " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.min")) + "\n                        ") ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.number",
          value: form.min,
          expression: 'form["min"]',
          modifiers: {
            number: !0
          }
        } ],
        staticClass: "horizontal-input",
        attrs: {
          type: "text"
        },
        domProps: {
          value: form.min
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(form, "min", _vm._n($event.target.value));
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }) ]) : _vm._e(), _vm._v(" "), "range" === form.type ? _c("div", {
        staticClass: "horizontal-item"
      }, [ _c("p", {
        staticClass: "horizontal-text"
      }, [ _vm._v("\n                            " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.max")) + "\n                        ") ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.number",
          value: form.max,
          expression: 'form["max"]',
          modifiers: {
            number: !0
          }
        } ],
        staticClass: "horizontal-input",
        attrs: {
          type: "text"
        },
        domProps: {
          value: form.max
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(form, "max", _vm._n($event.target.value));
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }) ]) : _vm._e(), _vm._v(" "), "radio" === form.type ? _c("div", {
        staticStyle: {
          "margin-top": "10px"
        }
      }, [ _c("p", {
        staticStyle: {
          "text-align": "center"
        }
      }, [ _vm._v("\n                            " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.config_forms.labels")) + "\n                        ") ]), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex",
          "flex-wrap": "wrap",
          "margin-top": "2px"
        }
      }, [ _vm._l(form.tmp_labels, function(value, index) {
        return _c("div", {
          staticStyle: {
            width: "49%",
            "margin-left": "2px",
            "margin-top": "2px",
            overflow: "visible"
          }
        }, [ _c("input", {
          directives: [ {
            name: "model",
            rawName: "v-model.trim",
            value: value[0],
            expression: "value[0]",
            modifiers: {
              trim: !0
            }
          } ],
          staticClass: "labels",
          staticStyle: {
            width: "30%"
          },
          attrs: {
            type: "text"
          },
          domProps: {
            value: value[0]
          },
          on: {
            blur: [ function($event) {
              return _vm.updateSingleConfigForm(formIndex);
            }, function($event) {
              return _vm.$forceUpdate();
            } ],
            input: function($event) {
              $event.target.composing || _vm.$set(value, 0, $event.target.value.trim());
            }
          }
        }), _vm._v(" "), _c("input", {
          directives: [ {
            name: "model",
            rawName: "v-model.trim",
            value: value[1],
            expression: "value[1]",
            modifiers: {
              trim: !0
            }
          } ],
          staticClass: "labels",
          staticStyle: {
            width: "50%"
          },
          attrs: {
            type: "text"
          },
          domProps: {
            value: value[1]
          },
          on: {
            blur: [ function($event) {
              return _vm.updateSingleConfigForm(formIndex);
            }, function($event) {
              return _vm.$forceUpdate();
            } ],
            input: function($event) {
              $event.target.composing || _vm.$set(value, 1, $event.target.value.trim());
            }
          }
        }), _vm._v(" "), _c("i", {
          staticClass: "fa-solid fa-trash-can extra-delete",
          on: {
            click: function($event) {
              return _vm.deleteConfigFormLabels(formIndex, index);
            }
          }
        }) ]);
      }), _vm._v(" "), _c("button", {
        staticStyle: {
          width: "44.8%",
          "margin-left": "2px",
          "margin-top": "2px"
        },
        on: {
          click: function($event) {
            return _vm.addNewConfigFormLabels(formIndex);
          }
        }
      }, [ _c("i", {
        staticClass: "fa-solid fa-plus",
        staticStyle: {
          "vertical-align": "middle"
        }
      }), _vm._v(" "), _c("span", [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.add"))) ]) ]) ], 2) ]) : _vm._e() ]);
    }), 0) ]), _vm._v(" "), _c("div", {
      staticClass: "properties-item"
    }, [ _c("button", {
      staticStyle: {
        width: "100%"
      },
      on: {
        click: _vm.addNewConfigForm
      }
    }, [ _vm._v("\n                " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.add")) + "\n            ") ]) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        "margin-top": "20px",
        "margin-bottom": "10px"
      }
    }, [ _c("button", {
      staticStyle: {
        width: "48%",
        "margin-right": "10px"
      },
      on: {
        click: function($event) {
          return _vm.onSaveExtraAnimationButtons(!1);
        }
      }
    }, [ _vm._v("\n            " + _vm._s(_vm.tl("menu.ysm_utils.save")) + "\n        ") ]), _vm._v(" "), _c("button", {
      staticStyle: {
        width: "48%"
      },
      on: {
        click: function($event) {
          return _vm.onSaveExtraAnimationButtons(!0);
        }
      }
    }, [ _vm._v("\n            " + _vm._s(_vm.tl("menu.ysm_utils.save_quit")) + "\n        ") ]) ]) ]);
  },
  staticRenderFns: [ function() {
    var _h = this.$createElement, _c = this._self._c || _h;
    return _c("button", {
      staticClass: "icon-button handle"
    }, [ _c("i", {
      staticClass: "fas fa-arrows-alt"
    }) ]);
  } ]
}, function(inject) {
  inject && inject("data-v-31ffdbd6_0", {
    source: ".properties[data-v-31ffdbd6]{width:100%;overflow-y:auto;padding:10px 20px}.properties-item[data-v-31ffdbd6]{width:100%;margin-top:10px;margin-bottom:20px}.title[data-v-31ffdbd6]{margin:0;padding:0;font-size:large}.desc[data-v-31ffdbd6]{margin:0;padding:0;color:#6a6a6d}.horizontal-item[data-v-31ffdbd6]{display:flex}.horizontal-text[data-v-31ffdbd6]{width:12%;margin-top:7px;font-size:15px}.horizontal-input[data-v-31ffdbd6]{flex:1;border-radius:1px;margin-top:5px;padding:2px 2px 2px 5px;height:30px;font-size:15px;background-color:#1c2026;border-style:solid;border-width:1px;border-color:#181a1f}.horizontal-option[data-v-31ffdbd6]{flex:1;border-radius:1px;margin-top:5px;padding:2px 2px 2px 5px;height:30px;font-size:15px}.all-item[data-v-31ffdbd6]{height:800px;overflow:auto;padding:20px 30px 20px 30px;border-radius:2px;border-style:solid;border-width:1px;border-color:rgb(24,26,31,.5);box-shadow:0 2px 12px 0 rgba(0,0,0,.3)}.config_forms[data-v-31ffdbd6]{margin-top:5px;margin-bottom:10px;padding:10px;border-radius:2px;border-style:solid;border-width:1px;border-color:rgb(24,26,31,.5);box-shadow:0 2px 12px 0 rgba(0,0,0,.3)}.input[data-v-31ffdbd6]{border-radius:1px;margin-top:5px;padding:2px 2px 2px 5px;width:100%;height:30px;font-size:15px;background-color:#1c2026;border-style:solid;border-width:1px;border-color:#181a1f}.labels[data-v-31ffdbd6]{border-radius:1px;margin-top:5px;margin-left:5px;padding:2px 2px 2px 5px;height:30px;font-size:15px;background-color:#1c2026;border-style:solid;border-width:1px;border-color:#181a1f}.extra-delete[data-v-31ffdbd6]{width:20px;margin-left:2px}.extra-delete[data-v-31ffdbd6]:hover{color:#2d5ee8}.container[data-v-31ffdbd6]{display:flex;justify-content:flex-end}.right-align[data-v-31ffdbd6]{margin-left:auto}.icon-button[data-v-31ffdbd6]{margin:2px;padding:0;width:40px;min-width:30px;line-height:.5}.icon-button>i[data-v-31ffdbd6]{font-size:large;margin-left:4px}",
    map: void 0,
    media: void 0
  });
}, script$5, "data-v-31ffdbd6", 0, 0, 0, createInjector);

async function changeCurrentFile(packDir, pathValue, defaultDir, extension) {
  return await changeCurrentFileWithFilters(packDir, pathValue, defaultDir, [ {
    extensions: [ extension ],
    name: extension
  } ]);
}

async function changeCurrentFileWithFilters(packDir, pathValue, defaultDir, filters) {
  let result = await ysmCommunityNative.dialog.showOpenDialog({
    title: tl("menu.ysm_utils.load_info_menu.files.select_files"),
    filters: filters,
    properties: [ "openFile" ]
  });
  if (result.filePaths[0]) {
    let srcFilePath;
    console.assert("" !== defaultDir), pathValue && 0 !== pathValue.length ? srcFilePath = path.join(packDir, pathValue) : (pathValue = path.join(defaultDir, pathToName(result.filePaths[0], !0)), 
    srcFilePath = path.join(packDir, pathValue), await async function(filePath) {
      const dir = path.dirname(filePath);
      await fs.promises.mkdir(dir, {
        recursive: !0
      });
    }(srcFilePath));
    let destFilePath = result.filePaths[0];
    if (arePathsEqual(srcFilePath, destFilePath)) return Blockbench.showQuickMessage(tl("menu.ysm_utils.load_info_menu.files.same_file"), 2e3), 
    pathValue;
    let oldFileExists = !1;
    if (fs.existsSync(srcFilePath) && (await ysmCommunityNative.shell.trashItem(srcFilePath), 
    oldFileExists = !0), fs.existsSync(destFilePath)) {
      await fs.promises.copyFile(destFilePath, srcFilePath) || (oldFileExists ? Blockbench.showQuickMessage(tl("menu.ysm_utils.load_info_menu.files.replace_success.remove_file"), 2e3) : Blockbench.showQuickMessage(tl("menu.ysm_utils.load_info_menu.files.replace_success"), 2e3));
    }
  }
  return pathValue;
}

async function removeCurrentFile(packDir, pathValue, callback) {
  if (!pathValue || 0 === pathValue.length) return void callback();
  let srcFilePath = path.join(packDir, pathValue);
  fs.existsSync(srcFilePath) ? Blockbench.showMessageBox({
    icon: "fa-warning",
    title: tl("level.ysm_utils.warning"),
    message: tl("menu.ysm_utils.load_info_menu.files.delete_files"),
    buttons: [ tl("dialog.confirm"), tl("dialog.cancel") ],
    confirm: 0,
    cancel: 1
  }, button => {
    if (0 === button) {
      let srcFilePath = path.join(packDir, pathValue);
      fs.existsSync(srcFilePath) && ysmCommunityNative.shell.trashItem(srcFilePath), callback();
    }
  }) : callback();
}

var script$4 = {
  props: {
    importModelMenuDialog: {
      type: Object,
      required: !0
    },
    ysmJson: {
      type: Object,
      required: !0
    },
    packDirectory: {
      type: Object,
      required: !0
    }
  },
  data: () => ({}),
  methods: {
    join: path.join,
    tl: tl,
    shouldAddLine: function(index, listSize) {
      return 0 !== index && (index !== listSize - 2 ? index % 8 == 6 : void 0);
    },
    deleteExtraAnimation: function(index) {
      this.tmpExtraAnimation.splice(index, 1), this.updateExtraAnimation(), this.$forceUpdate();
    },
    addNewExtraAnimation: function() {
      this.tmpExtraAnimation.push([ "", "" ]), this.$forceUpdate();
    },
    updateExtraAnimation: function() {
      let tmp = {};
      for (let value of this.tmpExtraAnimation) tmp[value[0]] = value[1];
      this.properties.extra_animation = tmp;
    },
    editExtraAnimation: function(index) {
      this.updateExtraAnimation(), function(ysmJson, packDirectory, index) {
        let editExtraAnimationDialog = new Dialog({
          title: "menu.ysm_utils.load_info_menu.properties.extra_animation",
          cancel_on_click_outside: !1,
          width: 600,
          singleButton: !0,
          component: {
            data: () => ({
              editExtraAnimationDialog: editExtraAnimationDialog,
              ysmJson: ysmJson,
              packDirectory: packDirectory,
              index: index
            }),
            components: {
              extraAnimationVue: __vue_component__$8
            },
            template: '\n                <div>\n                    <extraAnimationVue :edit-extra-animation-dialog="editExtraAnimationDialog"\n                                       :ysm-json="ysmJson" :index="index"\n                                       :pack-directory=\'packDirectory\'/>\n                </div>'
          }
        });
        editExtraAnimationDialog.show();
      }(this.ysmJson, this.packDirectory, index);
    },
    deleteExtraAnimationClassify: function(index) {
      this.properties.extra_animation_classify.splice(index, 1), this.$forceUpdate();
    },
    addNewExtraAnimationClassify: function() {
      this.properties.extra_animation_classify.push({
        id: "",
        extra_animation: {}
      }), this.$forceUpdate();
    },
    editExtraAnimationClassify: function(index) {
      !function(ysmJson, packDirectory, index) {
        let editExtraAnimationClassifyDialog = new Dialog({
          title: "menu.ysm_utils.load_info_menu.properties.extra_animation_classify",
          cancel_on_click_outside: !1,
          width: 800,
          singleButton: !0,
          component: {
            data: () => ({
              editExtraAnimationClassifyDialog: editExtraAnimationClassifyDialog,
              ysmJson: ysmJson,
              packDirectory: packDirectory,
              index: index
            }),
            components: {
              extraAnimationClassifyVue: __vue_component__$7
            },
            template: '\n                <div>\n                    <extraAnimationClassifyVue :edit-extra-animation-classify-dialog="editExtraAnimationClassifyDialog"\n                                               :ysm-json="ysmJson" :index="index"\n                                               :pack-directory=\'packDirectory\'/>\n                </div>'
          }
        });
        editExtraAnimationClassifyDialog.show(), editExtraAnimationClassifyDialog.object && editExtraAnimationClassifyDialog.object.style && (editExtraAnimationClassifyDialog.object.style["max-width"] = "800px");
      }(this.ysmJson, this.packDirectory, index);
    },
    deleteExtraAnimationButtons: function(index) {
      this.properties.extra_animation_buttons.splice(index, 1), this.$forceUpdate();
    },
    addNewExtraAnimationButtons: function() {
      this.properties.extra_animation_buttons.push({
        id: "",
        name: "",
        config_forms: []
      }), this.$forceUpdate();
    },
    editExtraAnimationButtons: function(index) {
      !function(ysmJson, packDirectory, index) {
        let editExtraAnimationButtonsDialog = new Dialog({
          title: "menu.ysm_utils.load_info_menu.properties.extra_animation_buttons",
          cancel_on_click_outside: !1,
          width: 900,
          singleButton: !0,
          component: {
            data: () => ({
              editExtraAnimationButtonsDialog: editExtraAnimationButtonsDialog,
              ysmJson: ysmJson,
              packDirectory: packDirectory,
              index: index
            }),
            components: {
              extraAnimationButtonsVue: __vue_component__$5
            },
            template: '\n                <div>\n                    <extraAnimationButtonsVue :edit-extra-animation-buttons-dialog="editExtraAnimationButtonsDialog"\n                                              :ysm-json="ysmJson" :index="index"\n                                              :pack-directory=\'packDirectory\'/>\n                </div>'
          }
        });
        editExtraAnimationButtonsDialog.show(), editExtraAnimationButtonsDialog.object && editExtraAnimationButtonsDialog.object.style && (editExtraAnimationButtonsDialog.object.style["max-width"] = "900px");
      }(this.ysmJson, this.packDirectory, index);
    },
    changeImgFile: async function(pathValue, defaultDir) {
      return changeCurrentFileWithFilters(this.packDirectory, pathValue, defaultDir, [ {
        extensions: SUPPORTED_IMAGE_TYPES,
        name: "png, avif, webp, jpeg, jpg"
      } ]);
    },
    removeFile: function(pathValue, callback) {
      removeCurrentFile(this.packDirectory, pathValue, callback);
    }
  },
  computed: {
    properties: function() {
      return this.ysmJson.properties;
    },
    tmpExtraAnimation: function() {
      let output = [];
      for (let key in this.properties.extra_animation) output.push([ key, this.properties.extra_animation[key] ]);
      return output;
    },
    allAnimations: function() {
      let keys = new Set, allAnimationList = this.ysmJson?.files.player.animation ?? {};
      for (let key in allAnimationList) {
        let filePath = path.join(this.packDirectory, allAnimationList[key]);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          let content = fs.readFileSync(path.join(this.packDirectory, allAnimationList[key]), "utf8"), animations = autoParseJSON(content).animations ?? {};
          Object.keys(animations).forEach(name => keys.add(name));
        }
      }
      return keys;
    },
    allTexture: function() {
      let keys = new Set, textureElement = this.ysmJson?.files.player.texture;
      for (let element of textureElement) "string" == typeof element ? keys.add(pathToName(element, !1)) : "object" == typeof element && element.uv && keys.add(pathToName(element.uv, !1));
      return keys;
    }
  }
};

const __vue_component__$4 = normalizeComponent({
  render: function() {
    var _vm = this, _h = _vm.$createElement, _c = _vm._self._c || _h;
    return _c("div", {
      staticClass: "properties"
    }, [ _c("div", {
      staticClass: "horizontal-item"
    }, [ _c("div", {
      staticStyle: {
        width: "50%"
      }
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.height_scale"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.height_scale.desc"))) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "50%",
        margin: "0 auto"
      }
    }, [ _c("p", {
      staticStyle: {
        "font-size": "large"
      }
    }, [ _vm._v(_vm._s(_vm.ysmJson.properties.height_scale)) ]), _vm._v(" "), _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.number",
        value: _vm.properties.height_scale,
        expression: "properties['height_scale']",
        modifiers: {
          number: !0
        }
      } ],
      staticClass: "range",
      attrs: {
        type: "range",
        max: "2",
        min: "0.05",
        step: "0.05"
      },
      domProps: {
        value: _vm.properties.height_scale
      },
      on: {
        __r: function($event) {
          _vm.$set(_vm.properties, "height_scale", _vm._n($event.target.value));
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }) ]) ]), _vm._v(" "), _c("div", {
      staticClass: "horizontal-item"
    }, [ _c("div", {
      staticStyle: {
        width: "50%"
      }
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.width_scale"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.width_scale.desc"))) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "50%",
        margin: "0 auto"
      }
    }, [ _c("p", {
      staticStyle: {
        "font-size": "large"
      }
    }, [ _vm._v(_vm._s(_vm.ysmJson.properties.width_scale)) ]), _vm._v(" "), _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.number",
        value: _vm.properties.width_scale,
        expression: "properties['width_scale']",
        modifiers: {
          number: !0
        }
      } ],
      staticClass: "range",
      attrs: {
        type: "range",
        max: "2",
        min: "0.05",
        step: "0.05"
      },
      domProps: {
        value: _vm.properties.width_scale
      },
      on: {
        __r: function($event) {
          _vm.$set(_vm.properties, "width_scale", _vm._n($event.target.value));
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }) ]) ]), _vm._v(" "), _c("div", {
      staticClass: "properties-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.desc"))) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        display: "flex",
        "flex-wrap": "wrap",
        "margin-top": "10px"
      }
    }, [ _vm._l(_vm.tmpExtraAnimation, function(value, index) {
      return _c("div", {
        staticStyle: {
          width: "49%",
          "margin-left": "2px",
          "margin-top": "2px",
          overflow: "visible"
        }
      }, [ _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: value[0],
          expression: "value[0]",
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "input",
        staticStyle: {
          width: "30%",
          "margin-left": "2px"
        },
        attrs: {
          type: "text",
          disabled: ""
        },
        domProps: {
          value: value[0]
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(value, 0, $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: value[1],
          expression: "value[1]",
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "input",
        staticStyle: {
          width: "40%",
          "margin-left": "2px"
        },
        attrs: {
          type: "text",
          disabled: ""
        },
        domProps: {
          value: value[1]
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(value, 1, $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }), _vm._v(" "), _c("i", {
        staticClass: "fa-solid fa-pen-to-square extra-delete",
        on: {
          click: function($event) {
            return _vm.editExtraAnimation(index);
          }
        }
      }), _vm._v(" "), _c("i", {
        staticClass: "fa-solid fa-trash-can extra-delete",
        on: {
          click: function($event) {
            return _vm.deleteExtraAnimation(index);
          }
        }
      }), _vm._v(" "), _vm.shouldAddLine(index, _vm.tmpExtraAnimation.length) ? _c("hr", {
        staticStyle: {
          width: "192.5%",
          "border-top": "3px dashed #1e1e22"
        }
      }) : _vm._e() ]);
    }), _vm._v(" "), _c("button", {
      staticStyle: {
        width: "44.8%",
        "margin-left": "2px",
        "margin-top": "2px"
      },
      on: {
        click: function($event) {
          return _vm.addNewExtraAnimation();
        }
      }
    }, [ _c("i", {
      staticClass: "fa-solid fa-plus",
      staticStyle: {
        "vertical-align": "middle"
      }
    }), _vm._v(" "), _c("span", [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.add"))) ]) ]) ], 2) ]), _vm._v(" "), _c("div", {
      staticClass: "properties-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_classify"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_classify.desc"))) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        display: "flex",
        "flex-wrap": "wrap",
        "margin-top": "10px"
      }
    }, [ _vm._l(_vm.properties.extra_animation_classify, function(value, index) {
      return _c("div", {
        staticStyle: {
          width: "49%",
          "margin-left": "2px",
          "margin-top": "2px",
          overflow: "visible"
        }
      }, [ _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model",
          value: value.id,
          expression: "value['id']"
        } ],
        staticClass: "input",
        staticStyle: {
          width: "72%",
          "margin-left": "2px"
        },
        attrs: {
          type: "text",
          disabled: ""
        },
        domProps: {
          value: value.id
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(value, "id", $event.target.value);
          }
        }
      }), _vm._v(" "), _c("i", {
        staticClass: "fa-solid fa-pen-to-square extra-delete",
        on: {
          click: function($event) {
            return _vm.editExtraAnimationClassify(index);
          }
        }
      }), _vm._v(" "), _c("i", {
        staticClass: "fa-solid fa-trash-can extra-delete",
        on: {
          click: function($event) {
            return _vm.deleteExtraAnimationClassify(index);
          }
        }
      }) ]);
    }), _vm._v(" "), _c("button", {
      staticStyle: {
        width: "44.8%",
        "margin-left": "2px",
        "margin-top": "2px"
      },
      on: {
        click: _vm.addNewExtraAnimationClassify
      }
    }, [ _c("i", {
      staticClass: "fa-solid fa-plus",
      staticStyle: {
        "vertical-align": "middle"
      }
    }), _vm._v(" "), _c("span", [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.add"))) ]) ]) ], 2) ]), _vm._v(" "), _c("div", {
      staticClass: "properties-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation_buttons.desc"))) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        display: "flex",
        "flex-wrap": "wrap",
        "margin-top": "10px"
      }
    }, [ _vm._l(_vm.properties.extra_animation_buttons, function(value, index) {
      return _c("div", {
        staticStyle: {
          width: "49%",
          "margin-left": "2px",
          "margin-top": "2px",
          overflow: "visible"
        }
      }, [ _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model",
          value: value.id,
          expression: "value['id']"
        } ],
        staticClass: "input",
        staticStyle: {
          width: "72%",
          "margin-left": "2px"
        },
        attrs: {
          type: "text",
          disabled: ""
        },
        domProps: {
          value: value.id
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(value, "id", $event.target.value);
          }
        }
      }), _vm._v(" "), _c("i", {
        staticClass: "fa-solid fa-pen-to-square extra-delete",
        on: {
          click: function($event) {
            return _vm.editExtraAnimationButtons(index);
          }
        }
      }), _vm._v(" "), _c("i", {
        staticClass: "fa-solid fa-trash-can extra-delete",
        on: {
          click: function($event) {
            return _vm.deleteExtraAnimationButtons(index);
          }
        }
      }) ]);
    }), _vm._v(" "), _c("button", {
      staticStyle: {
        width: "44.8%",
        "margin-left": "2px",
        "margin-top": "2px"
      },
      on: {
        click: _vm.addNewExtraAnimationButtons
      }
    }, [ _c("i", {
      staticClass: "fa-solid fa-plus",
      staticStyle: {
        "vertical-align": "middle"
      }
    }), _vm._v(" "), _c("span", [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.extra_animation.add"))) ]) ]) ], 2) ]), _vm._v(" "), _c("div", {
      staticClass: "horizontal-item"
    }, [ _c("div", {
      staticStyle: {
        width: "68%"
      }
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.preview_animation"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.preview_animation.desc"))) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "20%",
        margin: "0 auto"
      }
    }, [ _c("select", {
      directives: [ {
        name: "model",
        rawName: "v-model",
        value: _vm.ysmJson.properties.preview_animation,
        expression: "ysmJson['properties']['preview_animation']"
      } ],
      staticStyle: {
        width: "100%",
        "text-align": "center"
      },
      on: {
        change: function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected;
          }).map(function(o) {
            return "_value" in o ? o._value : o.value;
          });
          _vm.$set(_vm.ysmJson.properties, "preview_animation", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }
      }
    }, [ _c("option", {
      attrs: {
        selected: ""
      }
    }, [ _vm._v(_vm._s(_vm.ysmJson.properties.preview_animation)) ]), _vm._v(" "), _vm._l(_vm.allAnimations, function(name) {
      return _c("option", [ _vm._v(_vm._s(name)) ]);
    }) ], 2) ]) ]), _vm._v(" "), _c("div", {
      staticClass: "horizontal-item"
    }, [ _c("div", {
      staticStyle: {
        width: "68%"
      }
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.default_texture"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.default_texture.desc"))) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "20%",
        margin: "0 auto"
      }
    }, [ _c("select", {
      directives: [ {
        name: "model",
        rawName: "v-model",
        value: _vm.ysmJson.properties.default_texture,
        expression: "ysmJson['properties']['default_texture']"
      } ],
      staticStyle: {
        width: "100%",
        "text-align": "center"
      },
      on: {
        change: function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected;
          }).map(function(o) {
            return "_value" in o ? o._value : o.value;
          });
          _vm.$set(_vm.ysmJson.properties, "default_texture", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }
      }
    }, [ _c("option", {
      attrs: {
        selected: ""
      }
    }, [ _vm._v(_vm._s(_vm.ysmJson.properties.default_texture)) ]), _vm._v(" "), _vm._l(_vm.allTexture, function(name) {
      return _c("option", [ _vm._v(_vm._s(name)) ]);
    }) ], 2) ]) ]), _vm._v(" "), _c("div", {
      staticClass: "properties-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.gui_foreground"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.gui_foreground.desc"))) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        display: "flex",
        "margin-top": "10px"
      }
    }, [ _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.properties.gui_foreground,
        expression: "properties['gui_foreground']",
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "input",
      attrs: {
        type: "text",
        readonly: ""
      },
      domProps: {
        value: _vm.properties.gui_foreground
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.properties, "gui_foreground", $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }), _vm._v(" "), _c("div", {
      staticStyle: {
        display: "flex",
        "margin-left": "2px"
      }
    }, [ _c("button", {
      staticClass: "icon-button",
      on: {
        click: function($event) {
          _vm.changeImgFile(_vm.properties.gui_foreground, "textures/gui").then(function(result) {
            return _vm.properties.gui_foreground = result;
          });
        }
      }
    }, [ _c("i", {
      staticClass: "fas fa-exchange-alt"
    }) ]), _vm._v(" "), _c("button", {
      staticClass: "icon-button",
      on: {
        click: function($event) {
          _vm.removeFile(_vm.properties.gui_foreground, function() {
            return _vm.properties.gui_foreground = "";
          });
        }
      }
    }, [ _c("i", {
      staticClass: "fa-solid fa-trash-can"
    }) ]) ]) ]) ]), _vm._v(" "), _c("div", {
      staticClass: "properties-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.gui_background"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.gui_background.desc"))) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        display: "flex",
        "margin-top": "10px"
      }
    }, [ _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.properties.gui_background,
        expression: "properties['gui_background']",
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "input",
      attrs: {
        type: "text",
        readonly: ""
      },
      domProps: {
        value: _vm.properties.gui_background
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.properties, "gui_background", $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }), _vm._v(" "), _c("div", {
      staticStyle: {
        display: "flex",
        "margin-left": "2px"
      }
    }, [ _c("button", {
      staticClass: "icon-button",
      on: {
        click: function($event) {
          _vm.changeImgFile(_vm.properties.gui_background, "textures/gui").then(function(result) {
            return _vm.properties.gui_background = result;
          });
        }
      }
    }, [ _c("i", {
      staticClass: "fas fa-exchange-alt"
    }) ]), _vm._v(" "), _c("button", {
      staticClass: "icon-button",
      on: {
        click: function($event) {
          _vm.removeFile(_vm.properties.gui_background, function() {
            return _vm.properties.gui_background = "";
          });
        }
      }
    }, [ _c("i", {
      staticClass: "fa-solid fa-trash-can"
    }) ]) ]) ]) ]), _vm._v(" "), _c("div", {
      staticClass: "horizontal-item"
    }, [ _c("div", {
      staticStyle: {
        width: "68%"
      }
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.free"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.free.desc"))) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "20%",
        margin: "0 auto"
      }
    }, [ _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model",
        value: _vm.properties.free,
        expression: "properties['free']"
      } ],
      staticStyle: {
        width: "100%"
      },
      attrs: {
        type: "checkbox"
      },
      domProps: {
        checked: Array.isArray(_vm.properties.free) ? _vm._i(_vm.properties.free, null) > -1 : _vm.properties.free
      },
      on: {
        change: function($event) {
          var $$a = _vm.properties.free, $$el = $event.target, $$c = !!$$el.checked;
          if (Array.isArray($$a)) {
            var $$i = _vm._i($$a, null);
            $$el.checked ? $$i < 0 && _vm.$set(_vm.properties, "free", $$a.concat([ null ])) : $$i > -1 && _vm.$set(_vm.properties, "free", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          } else _vm.$set(_vm.properties, "free", $$c);
        }
      }
    }) ]) ]), _vm._v(" "), _c("div", {
      staticClass: "horizontal-item"
    }, [ _c("div", {
      staticStyle: {
        width: "68%"
      }
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.render_layers_first"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.render_layers_first.desc"))) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "20%",
        margin: "0 auto"
      }
    }, [ _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model",
        value: _vm.properties.render_layers_first,
        expression: "properties['render_layers_first']"
      } ],
      staticStyle: {
        width: "100%"
      },
      attrs: {
        type: "checkbox"
      },
      domProps: {
        checked: Array.isArray(_vm.properties.render_layers_first) ? _vm._i(_vm.properties.render_layers_first, null) > -1 : _vm.properties.render_layers_first
      },
      on: {
        change: function($event) {
          var $$a = _vm.properties.render_layers_first, $$el = $event.target, $$c = !!$$el.checked;
          if (Array.isArray($$a)) {
            var $$i = _vm._i($$a, null);
            $$el.checked ? $$i < 0 && _vm.$set(_vm.properties, "render_layers_first", $$a.concat([ null ])) : $$i > -1 && _vm.$set(_vm.properties, "render_layers_first", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          } else _vm.$set(_vm.properties, "render_layers_first", $$c);
        }
      }
    }) ]) ]), _vm._v(" "), _c("div", {
      staticClass: "horizontal-item"
    }, [ _c("div", {
      staticStyle: {
        width: "68%"
      }
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.disable_preview_rotation"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.disable_preview_rotation.desc"))) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "20%",
        margin: "0 auto"
      }
    }, [ _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model",
        value: _vm.properties.disable_preview_rotation,
        expression: "properties['disable_preview_rotation']"
      } ],
      staticStyle: {
        width: "100%"
      },
      attrs: {
        type: "checkbox"
      },
      domProps: {
        checked: Array.isArray(_vm.properties.disable_preview_rotation) ? _vm._i(_vm.properties.disable_preview_rotation, null) > -1 : _vm.properties.disable_preview_rotation
      },
      on: {
        change: function($event) {
          var $$a = _vm.properties.disable_preview_rotation, $$el = $event.target, $$c = !!$$el.checked;
          if (Array.isArray($$a)) {
            var $$i = _vm._i($$a, null);
            $$el.checked ? $$i < 0 && _vm.$set(_vm.properties, "disable_preview_rotation", $$a.concat([ null ])) : $$i > -1 && _vm.$set(_vm.properties, "disable_preview_rotation", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          } else _vm.$set(_vm.properties, "disable_preview_rotation", $$c);
        }
      }
    }) ]) ]), _vm._v(" "), _c("div", {
      staticClass: "horizontal-item"
    }, [ _c("div", {
      staticStyle: {
        width: "68%"
      }
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.all_cutout"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.all_cutout.desc"))) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "20%",
        margin: "0 auto"
      }
    }, [ _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model",
        value: _vm.properties.all_cutout,
        expression: "properties['all_cutout']"
      } ],
      staticStyle: {
        width: "100%"
      },
      attrs: {
        type: "checkbox"
      },
      domProps: {
        checked: Array.isArray(_vm.properties.all_cutout) ? _vm._i(_vm.properties.all_cutout, null) > -1 : _vm.properties.all_cutout
      },
      on: {
        change: function($event) {
          var $$a = _vm.properties.all_cutout, $$el = $event.target, $$c = !!$$el.checked;
          if (Array.isArray($$a)) {
            var $$i = _vm._i($$a, null);
            $$el.checked ? $$i < 0 && _vm.$set(_vm.properties, "all_cutout", $$a.concat([ null ])) : $$i > -1 && _vm.$set(_vm.properties, "all_cutout", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          } else _vm.$set(_vm.properties, "all_cutout", $$c);
        }
      }
    }) ]) ]), _vm._v(" "), _c("div", {
      staticClass: "horizontal-item"
    }, [ _c("div", {
      staticStyle: {
        width: "68%"
      }
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.gui_no_lighting"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.properties.gui_no_lighting.desc"))) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "20%",
        margin: "0 auto"
      }
    }, [ _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model",
        value: _vm.properties.gui_no_lighting,
        expression: "properties['gui_no_lighting']"
      } ],
      staticStyle: {
        width: "100%"
      },
      attrs: {
        type: "checkbox"
      },
      domProps: {
        checked: Array.isArray(_vm.properties.gui_no_lighting) ? _vm._i(_vm.properties.gui_no_lighting, null) > -1 : _vm.properties.gui_no_lighting
      },
      on: {
        change: function($event) {
          var $$a = _vm.properties.gui_no_lighting, $$el = $event.target, $$c = !!$$el.checked;
          if (Array.isArray($$a)) {
            var $$i = _vm._i($$a, null);
            $$el.checked ? $$i < 0 && _vm.$set(_vm.properties, "gui_no_lighting", $$a.concat([ null ])) : $$i > -1 && _vm.$set(_vm.properties, "gui_no_lighting", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          } else _vm.$set(_vm.properties, "gui_no_lighting", $$c);
        }
      }
    }) ]) ]) ]);
  },
  staticRenderFns: []
}, function(inject) {
  inject && inject("data-v-51574005_0", {
    source: ".properties[data-v-51574005]{width:100%;overflow-y:auto;padding:10px 20px}.properties-item[data-v-51574005]{height:100%;width:100%;margin-top:10px;margin-bottom:20px}.horizontal-item[data-v-51574005]{height:100%;width:100%;margin-top:10px;display:flex;align-items:center}.title[data-v-51574005]{margin:0;padding:0;font-size:large}.desc[data-v-51574005]{margin:0;padding:0;color:#6a6a6d}.range[data-v-51574005]{width:100%}.input[data-v-51574005]{border-radius:1px;padding:2px 2px 2px 5px;width:100%;background-color:#1c2026;border-style:solid;border-width:1px;border-color:#181a1f}.extra-delete[data-v-51574005]{width:20px;margin-left:2px}.extra-delete[data-v-51574005]:hover{color:#2d5ee8}.icon-button[data-v-51574005]{margin:2px;padding:0;width:40px;min-width:30px;line-height:.5}.icon-button>i[data-v-51574005]{font-size:large;margin-left:4px}",
    map: void 0,
    media: void 0
  });
}, script$4, "data-v-51574005", 0, 0, 0, createInjector);

const JSON_OPTIONS = {
  readtype: "text",
  errorbox: !0
}, IMG_OPTIONS = {
  readtype: "image",
  errorbox: !0
};

function importMainFile(packDir, ysmJson, dialog, config = {}) {
  let files = ysmJson.files;
  if (!files) return void showMissingFieldTip("files");
  let playerFiles = files.player;
  if (!playerFiles) return void showMissingFieldTip("player");
  let mainModel = playerFiles.model.main;
  if (!mainModel || 0 === mainModel.length) return void showMissingFieldTip("model/main");
  let mainModelPath = path.join(packDir, mainModel);
  fs.existsSync(mainModelPath) ? Blockbench.readFile([ mainModelPath ], JSON_OPTIONS, files => {
    loadModelFile(files[0]), importTexture(playerFiles, packDir, dialog, config);
  }) : showMissingFileTip(mainModelPath);
}

function importArmFile(packDir, ysmJson, dialog, config = {}) {
  let files = ysmJson.files;
  if (!files) return void showMissingFieldTip("files");
  let playerFiles = files.player;
  if (!playerFiles) return void showMissingFieldTip("player");
  let armModel = playerFiles.model.arm;
  if (!armModel || 0 === armModel.length) return void showMissingFieldTip("model/arm");
  let armModelPath = path.join(packDir, armModel);
  fs.existsSync(armModelPath) ? Blockbench.readFile([ armModelPath ], JSON_OPTIONS, files => {
    loadModelFile(files[0]), importTexture(playerFiles, packDir, dialog, config);
  }) : showMissingFileTip(armModelPath);
}

function importTexture(objFiles, packDir, dialog, config = {}) {
  let images = [], texture = objFiles.texture, loadAnimation = config.load_animation ?? !1;
  "string" == typeof texture ? pushImgFile(images, texture, packDir) : Array.isArray(texture) ? texture.forEach(value => {
    "string" == typeof value ? pushImgFile(images, value, packDir) : "object" == typeof value && pushImgFile(images, value.uv, packDir);
  }) : "object" == typeof texture && pushImgFile(images, texture.uv, packDir), Blockbench.readFile(images, IMG_OPTIONS, files => {
    files.forEach(file => (new Texture).fromFile(file).add()), loadAnimation ? function(objFiles, packDir, dialog, config = {}) {
      let animations = [], animation = objFiles.animation, loadController = config.load_animation_controllers ?? !1;
      "string" == typeof animation ? pushFile(animations, animation, ".json", packDir) : "object" == typeof animation && Object.values(animation).forEach(value => {
        pushFile(animations, value, ".json", packDir);
      });
      Blockbench.readFile(animations, JSON_OPTIONS, files => {
        files.forEach(file => ysmCommunityNative.loadAnimationFile(file)), loadController ? function(objFiles, packDir, dialog) {
          let animationControllersData = objFiles.animation_controllers ?? [];
          animationControllersData.length <= 0 && dialog.close();
          let animationControllers = [];
          animationControllersData.forEach(value => pushFile(animationControllers, value, ".json", packDir)), 
          animationControllers.length <= 0 && dialog.close();
          Blockbench.readFile(animationControllers, JSON_OPTIONS, files => {
            files.forEach(file => {
              ysmCommunityNative.loadAnimationFile(file);
            }), dialog.close();
          });
        }(objFiles, packDir, dialog) : dialog.close();
      });
    }(objFiles, packDir, dialog, config) : dialog.close(), function(packDir) {
      Project && (Project.ysm_project_info = {
        path: packDir
      }, Blockbench.setStatusBarText(tl("menu.ysm_utils.current_info_menu.status_bar_text")));
    }(packDir);
  });
}

function pushFile(files, pathValue, suffix, packDir) {
  if (pathValue && pathValue.endsWith(suffix)) {
    let filePath = path.join(packDir, pathValue);
    fs.existsSync(filePath) && files.push(filePath);
  }
}

function pushImgFile(files, pathValue, packDir) {
  if (pathValue && function(pathValue) {
    if (!pathValue || "string" != typeof pathValue) return !1;
    let lowerPath = pathValue.toLowerCase();
    for (let type of SUPPORTED_IMAGE_TYPES) if (lowerPath.endsWith("." + type)) return !0;
    return !1;
  }(pathValue)) {
    let filePath = path.join(packDir, pathValue);
    fs.existsSync(filePath) && files.push(filePath);
  }
}

function showMissingFieldTip(field) {
  Blockbench.showQuickMessage(tl("menu.ysm_utils.file_import.missing_field", [ field ]), 3e3);
}

function showMissingFileTip(file) {
  Blockbench.showQuickMessage(tl("menu.ysm_utils.file_import.missing_file", [ file ]), 3e3);
}

const __vue_component__$3 = normalizeComponent({
  render: function() {
    var _vm = this, _h = _vm.$createElement, _c = _vm._self._c || _h;
    return _c("div", {
      staticClass: "new-author"
    }, [ _c("button", {
      staticStyle: {
        width: "49%"
      },
      on: {
        click: _vm.importMainModel
      }
    }, [ _vm._v("\n        " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.import_main")) + "\n    ") ]), _vm._v(" "), _c("button", {
      staticStyle: {
        width: "49%"
      },
      on: {
        click: _vm.importArmModel
      }
    }, [ _vm._v("\n        " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.import_arm")) + "\n    ") ]), _vm._v(" "), _c("div", {
      staticClass: "new-author-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.player.model"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.player.model.desc"))) ]), _vm._v(" "), _c("div", {
      staticClass: "li-item"
    }, [ _c("div", {
      staticStyle: {
        display: "flex"
      }
    }, [ _c("p", {
      staticClass: "li-text"
    }, [ _vm._v(" " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.player.model.main"))) ]), _vm._v(" "), _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.playerFiles.model.main,
        expression: "playerFiles['model']['main']",
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "input",
      attrs: {
        type: "text",
        readonly: ""
      },
      domProps: {
        value: _vm.playerFiles.model.main
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.playerFiles.model, "main", $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }), _vm._v(" "), _c("div", {
      staticStyle: {
        display: "flex",
        "margin-left": "2px"
      }
    }, [ _c("button", {
      staticClass: "icon-button",
      on: {
        click: function($event) {
          _vm.changeFile(_vm.playerFiles.model.main, "models").then(function(result) {
            return _vm.playerFiles.model.main = result;
          });
        }
      }
    }, [ _c("i", {
      staticClass: "fas fa-exchange-alt"
    }) ]) ]) ]), _vm._v(" "), _c("div", {
      staticStyle: {
        display: "flex"
      }
    }, [ _c("p", {
      staticClass: "li-text"
    }, [ _vm._v(" " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.player.model.arm"))) ]), _vm._v(" "), _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.playerFiles.model.arm,
        expression: "playerFiles['model']['arm']",
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "input",
      attrs: {
        type: "text",
        readonly: ""
      },
      domProps: {
        value: _vm.playerFiles.model.arm
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.playerFiles.model, "arm", $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }), _vm._v(" "), _c("div", {
      staticStyle: {
        display: "flex",
        "margin-left": "2px"
      }
    }, [ _c("button", {
      staticClass: "icon-button",
      on: {
        click: function($event) {
          _vm.changeFile(_vm.playerFiles.model.arm, "models").then(function(result) {
            return _vm.playerFiles.model.arm = result;
          });
        }
      }
    }, [ _c("i", {
      staticClass: "fas fa-exchange-alt"
    }) ]) ]) ]) ]) ]), _vm._v(" "), _c("div", {
      staticClass: "new-author-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.player.animation"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.player.animation.desc"))) ]), _vm._v(" "), _c("div", {
      staticClass: "li-item"
    }, [ _c("div", {
      staticStyle: {
        display: "flex"
      }
    }, [ _c("p", {
      staticClass: "li-text"
    }, [ _vm._v(" " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.player.animation.main"))) ]), _vm._v(" "), _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model.trim",
        value: _vm.animations.main,
        expression: "animations['main']",
        modifiers: {
          trim: !0
        }
      } ],
      staticClass: "input",
      attrs: {
        type: "text",
        readonly: ""
      },
      domProps: {
        value: _vm.animations.main
      },
      on: {
        input: function($event) {
          $event.target.composing || _vm.$set(_vm.animations, "main", $event.target.value.trim());
        },
        blur: function($event) {
          return _vm.$forceUpdate();
        }
      }
    }), _vm._v(" "), _c("div", {
      staticStyle: {
        display: "flex",
        "margin-left": "2px"
      }
    }, [ _c("button", {
      staticClass: "icon-button",
      on: {
        click: function($event) {
          _vm.changeFile(_vm.animations.main, "animations").then(function(result) {
            return _vm.animations.main = result;
          });
        }
      }
    }, [ _c("i", {
      staticClass: "fas fa-exchange-alt"
    }) ]) ]) ]), _vm._v(" "), _vm._l(_vm.animation_type, function(name) {
      return _c("div", {
        staticStyle: {
          display: "flex"
        }
      }, [ _c("p", {
        staticClass: "li-text"
      }, [ _vm._v(" " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.player.animation." + name))) ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: _vm.animations[name],
          expression: "animations[name]",
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "input",
        attrs: {
          type: "text",
          readonly: ""
        },
        domProps: {
          value: _vm.animations[name]
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(_vm.animations, name, $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex",
          "margin-left": "2px"
        }
      }, [ _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.changeFile(_vm.animations[name], "animations").then(function(result) {
              return _vm.animations[name] = result;
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fas fa-exchange-alt"
      }) ]), _vm._v(" "), _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.removeFile(_vm.animations[name], function() {
              return _vm.animations[name] = "";
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fa-solid fa-trash-can"
      }) ]) ]) ]);
    }) ], 2) ]), _vm._v(" "), _c("div", {
      staticClass: "new-author-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.player.animation_controllers"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.player.animation_controllers.desc"))) ]), _vm._v(" "), _vm.playerFiles.animation_controllers && _vm.playerFiles.animation_controllers.length > 0 ? _c("div", {
      staticClass: "li-item"
    }, _vm._l(_vm.playerFiles.animation_controllers, function(value, index) {
      return _c("div", {
        staticStyle: {
          display: "flex"
        }
      }, [ _c("p", {
        staticClass: "li-text"
      }, [ _vm._v("\n                    " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.player.animation_controllers.prefix", index + 1)) + "\n                ") ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: _vm.playerFiles.animation_controllers[index],
          expression: "playerFiles['animation_controllers'][index]",
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "input",
        attrs: {
          type: "text",
          readonly: ""
        },
        domProps: {
          value: _vm.playerFiles.animation_controllers[index]
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(_vm.playerFiles.animation_controllers, index, $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex",
          "margin-left": "2px"
        }
      }, [ _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.changeFile(value, "controller").then(function(result) {
              return _vm.playerFiles.animation_controllers[index] = result;
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fas fa-exchange-alt"
      }) ]), _vm._v(" "), _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.removeFile(value, function() {
              return _vm.playerFiles.animation_controllers.splice(index, 1);
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fa-solid fa-trash-can"
      }) ]) ]) ]);
    }), 0) : _vm._e(), _vm._v(" "), _c("button", {
      staticStyle: {
        width: "100%",
        "margin-top": "5px"
      },
      on: {
        click: _vm.addNewControllers
      }
    }, [ _vm._v("\n            " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.add_new_controllers")) + "\n        ") ]) ]), _vm._v(" "), _c("div", {
      staticClass: "new-author-item"
    }, [ _c("p", {
      staticClass: "title"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.player.texture"))) ]), _vm._v(" "), _c("p", {
      staticClass: "desc"
    }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.player.texture.desc"))) ]), _vm._v(" "), _vm._l(_vm.playerFiles.texture, function(texture, index) {
      return _c("div", {
        staticClass: "li-item"
      }, [ index > 0 ? _c("div", {
        staticClass: "texture-delete",
        on: {
          click: function($event) {
            return _vm.deleteCurrentTexture(_vm.playerFiles.texture, index);
          }
        }
      }, [ _c("i", {
        staticClass: "fas fa-times"
      }) ]) : _vm._e(), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex"
        }
      }, [ _c("p", {
        staticClass: "li-text"
      }, [ _vm._v(" " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.player.texture.uv"))) ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: texture.uv,
          expression: "texture['uv']",
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "input",
        attrs: {
          type: "text",
          readonly: ""
        },
        domProps: {
          value: texture.uv
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(texture, "uv", $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex",
          "margin-left": "2px"
        }
      }, [ _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.changeImgFile(texture.uv, "textures").then(function(result) {
              return texture.uv = result;
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fas fa-exchange-alt"
      }) ]) ]) ]), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex"
        }
      }, [ _c("p", {
        staticClass: "li-text"
      }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.player.texture.normal"))) ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: texture.normal,
          expression: "texture['normal']",
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "input",
        attrs: {
          type: "text",
          readonly: ""
        },
        domProps: {
          value: texture.normal
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(texture, "normal", $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex",
          "margin-left": "2px"
        }
      }, [ _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.changeImgFile(texture.normal, "textures/pbr").then(function(result) {
              return texture.normal = result;
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fas fa-exchange-alt"
      }) ]), _vm._v(" "), _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.removeFile(texture.normal, function() {
              return texture.normal = "";
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fa-solid fa-trash-can"
      }) ]) ]) ]), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex"
        }
      }, [ _c("p", {
        staticClass: "li-text"
      }, [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.player.texture.specular"))) ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: texture.specular,
          expression: "texture['specular']",
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "input",
        attrs: {
          type: "text",
          readonly: ""
        },
        domProps: {
          value: texture.specular
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(texture, "specular", $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex",
          "margin-left": "2px"
        }
      }, [ _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.changeImgFile(texture.specular, "textures/pbr").then(function(result) {
              return texture.specular = result;
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fas fa-exchange-alt"
      }) ]), _vm._v(" "), _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.removeFile(texture.specular, function() {
              return texture.specular = "";
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fa-solid fa-trash-can"
      }) ]) ]) ]) ]);
    }), _vm._v(" "), _c("div", {
      staticStyle: {
        "margin-top": "5px"
      }
    }, [ _c("button", {
      staticStyle: {
        width: "100%"
      },
      on: {
        click: function($event) {
          return _vm.addNewTexture(_vm.playerFiles.texture);
        }
      }
    }, [ _vm._v("\n                " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.add_new_texture")) + "\n            ") ]) ]) ], 2) ]);
  },
  staticRenderFns: []
}, function(inject) {
  inject && inject("data-v-60bcaa4f_0", {
    source: ".new-author[data-v-60bcaa4f]{width:100%;overflow-y:auto;padding:10px 20px}.new-author-item[data-v-60bcaa4f]{height:100%;width:100%;margin-top:10px}.title[data-v-60bcaa4f]{margin:0;padding:0;font-size:large}.desc[data-v-60bcaa4f]{margin:0;padding:0;color:#6a6a6d}.li-text[data-v-60bcaa4f]{width:20%;margin-top:7px;font-size:15px;color:#8b8b8d}.input[data-v-60bcaa4f]{width:65%;border-radius:1px;margin-top:5px;padding:2px 2px 2px 5px;height:30px;font-size:15px;background-color:#1c2026;border-style:solid;border-width:1px;border-color:#181a1f}.li-item[data-v-60bcaa4f]{margin-top:5px;margin-bottom:5px;padding:10px;border-radius:2px;border-style:solid;border-width:1px;border-color:rgb(24,26,31,.5);box-shadow:0 2px 12px 0 rgba(0,0,0,.3)}.icon-button[data-v-60bcaa4f]{margin:2px;padding:0;width:40px;min-width:30px;line-height:.5}.icon-button>i[data-v-60bcaa4f]{font-size:large;margin-left:4px}.texture-delete[data-v-60bcaa4f]{position:relative;width:100%;height:20px}.texture-delete>i[data-v-60bcaa4f]{position:absolute;top:0;right:0;font-size:x-large}.texture-delete>i[data-v-60bcaa4f]:hover{color:#ef3636}",
    map: void 0,
    media: void 0
  });
}, {
  props: {
    importModelMenuDialog: {
      type: Object,
      required: !0
    },
    ysmJson: {
      type: Object,
      required: !0
    },
    packDirectory: {
      type: Object,
      required: !0
    }
  },
  data: () => ({
    animation_type: [ "arm", "extra", "tac", "carryon", "swem", "parcool", "slashblade", "tlm", "fp_arm" ]
  }),
  methods: {
    join: path.join,
    tl: tl,
    changeFile: async function(pathValue, defaultDir, extension = "json") {
      return changeCurrentFile(this.packDirectory, pathValue, defaultDir, extension);
    },
    changeImgFile: async function(pathValue, defaultDir) {
      return changeCurrentFileWithFilters(this.packDirectory, pathValue, defaultDir, [ {
        extensions: SUPPORTED_IMAGE_TYPES,
        name: "png, avif, webp, jpeg, jpg"
      } ]);
    },
    removeFile: function(pathValue, callback) {
      removeCurrentFile(this.packDirectory, pathValue, callback);
    },
    importArmModel: function() {
      this.importModelMenuDialog.onCancel() && importArmFile(this.packDirectory, this.ysmJson, this.importModelMenuDialog);
    },
    importMainModel: function() {
      this.importModelMenuDialog.onCancel() && importMainFile(this.packDirectory, this.ysmJson, this.importModelMenuDialog);
    },
    addNewTexture: function(textures) {
      textures.push({
        uv: "",
        normal: "",
        specular: ""
      });
    },
    addNewControllers: function() {
      this.playerFiles.animation_controllers.push("");
    },
    deleteCurrentTexture: function(textures, index) {
      let texture = textures[index], deleteFiles = [];
      for (let value of Object.values(texture)) {
        let filePath = path.join(this.packDirectory, value);
        value.length > 0 && fs.existsSync(filePath) && deleteFiles.push(filePath);
      }
      if (deleteFiles.length <= 0) return void textures.splice(index, 1);
      let showMessage = tl("menu.ysm_utils.load_info_menu.files.delete_texture.tip");
      deleteFiles.forEach(name => {
        name.length > 0 && (showMessage += `<br> ${name}`);
      }), Blockbench.showMessageBox({
        icon: "fa-warning",
        title: tl("level.ysm_utils.warning"),
        message: showMessage,
        buttons: [ tl("dialog.confirm"), tl("dialog.cancel") ],
        confirm: 0,
        cancel: 1
      }, button => {
        if (0 === button) {
          for (let file of deleteFiles) ysmCommunityNative.shell.trashItem(file);
          textures.splice(index, 1);
        }
      });
    }
  },
  computed: {
    playerFiles: function() {
      return this.ysmJson.files.player;
    },
    animations: function() {
      return this.playerFiles.animation;
    }
  }
}, "data-v-60bcaa4f", 0, 0, 0, createInjector);

const __vue_component__$2 = normalizeComponent({
  render: function() {
    var _vm = this, _h = _vm.$createElement, _c = _vm._self._c || _h;
    return _c("div", {
      staticClass: "new-author"
    }, [ _vm._l(_vm.ysmJson.files[_vm.type], function(fileObj, fileIndex) {
      return _c("div", {
        staticClass: "new-author-item"
      }, [ _c("div", {
        staticClass: "li-item"
      }, [ _c("div", {
        staticClass: "file-delete",
        on: {
          click: function($event) {
            return _vm.deleteCurrentFile(_vm.ysmJson.files[_vm.type], fileIndex);
          }
        }
      }, [ _c("i", {
        staticClass: "fas fa-times"
      }) ]), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "block",
          width: "100%"
        }
      }, [ _c("p", {
        staticClass: "title"
      }, [ _vm._v(" " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.other.match"))) ]), _vm._v(" "), _c("p", {
        staticClass: "desc"
      }, [ _vm._v(" " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.other.match.desc"))) ]), _vm._v(" "), _vm._l(fileObj.match, function(_, index) {
        return _c("div", [ _c("input", {
          directives: [ {
            name: "model",
            rawName: "v-model.trim",
            value: fileObj.match[index],
            expression: "fileObj['match'][index]",
            modifiers: {
              trim: !0
            }
          } ],
          staticClass: "input",
          staticStyle: {
            "margin-top": "5px",
            width: "100%"
          },
          attrs: {
            type: "text"
          },
          domProps: {
            value: fileObj.match[index]
          },
          on: {
            input: function($event) {
              $event.target.composing || _vm.$set(fileObj.match, index, $event.target.value.trim());
            },
            blur: function($event) {
              return _vm.$forceUpdate();
            }
          }
        }) ]);
      }), _vm._v(" "), _c("button", {
        staticStyle: {
          "margin-top": "5px",
          "margin-bottom": "15px",
          width: "100%"
        },
        on: {
          click: function($event) {
            return fileObj.match.push("");
          }
        }
      }, [ _vm._v("\n                    " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.other.match.add")) + "\n                ") ]) ], 2), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex"
        }
      }, [ _c("p", {
        staticClass: "li-text"
      }, [ _vm._v(" " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.other.model"))) ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: fileObj.model,
          expression: "fileObj['model']",
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "input",
        attrs: {
          type: "text",
          readonly: ""
        },
        domProps: {
          value: fileObj.model
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(fileObj, "model", $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex",
          "margin-left": "2px"
        }
      }, [ _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.changeFile(fileObj.model, "models").then(function(result) {
              return fileObj.model = result;
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fas fa-exchange-alt"
      }) ]), _vm._v(" "), _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.removeFile(fileObj.model, function() {
              return fileObj.model = "";
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fa-solid fa-trash-can"
      }) ]) ]) ]), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex"
        }
      }, [ _c("p", {
        staticClass: "li-text"
      }, [ _vm._v(" " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.other.texture.uv"))) ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: fileObj.texture.uv,
          expression: "fileObj['texture']['uv']",
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "input",
        attrs: {
          type: "text",
          readonly: ""
        },
        domProps: {
          value: fileObj.texture.uv
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(fileObj.texture, "uv", $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex",
          "margin-left": "2px"
        }
      }, [ _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.changeImgFile(fileObj.texture.uv, "textures").then(function(result) {
              return fileObj.texture.uv = result;
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fas fa-exchange-alt"
      }) ]), _vm._v(" "), _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.removeFile(fileObj.texture.uv, function() {
              return fileObj.texture.uv = "";
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fa-solid fa-trash-can"
      }) ]) ]) ]), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex"
        }
      }, [ _c("p", {
        staticClass: "li-text"
      }, [ _vm._v(" " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.other.texture.normal"))) ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: fileObj.texture.normal,
          expression: "fileObj['texture']['normal']",
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "input",
        attrs: {
          type: "text",
          readonly: ""
        },
        domProps: {
          value: fileObj.texture.normal
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(fileObj.texture, "normal", $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex",
          "margin-left": "2px"
        }
      }, [ _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.changeImgFile(fileObj.texture.normal, "textures").then(function(result) {
              return fileObj.texture.normal = result;
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fas fa-exchange-alt"
      }) ]), _vm._v(" "), _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.removeFile(fileObj.texture.normal, function() {
              return fileObj.texture.normal = "";
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fa-solid fa-trash-can"
      }) ]) ]) ]), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex"
        }
      }, [ _c("p", {
        staticClass: "li-text"
      }, [ _vm._v(" " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.other.texture.specular"))) ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: fileObj.texture.specular,
          expression: "fileObj['texture']['specular']",
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "input",
        attrs: {
          type: "text",
          readonly: ""
        },
        domProps: {
          value: fileObj.texture.specular
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(fileObj.texture, "specular", $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex",
          "margin-left": "2px"
        }
      }, [ _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.changeImgFile(fileObj.texture.specular, "textures").then(function(result) {
              return fileObj.texture.specular = result;
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fas fa-exchange-alt"
      }) ]), _vm._v(" "), _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.removeFile(fileObj.texture.specular, function() {
              return fileObj.texture.specular = "";
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fa-solid fa-trash-can"
      }) ]) ]) ]), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex"
        }
      }, [ _c("p", {
        staticClass: "li-text"
      }, [ _vm._v(" " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.other.animation"))) ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: fileObj.animation,
          expression: "fileObj['animation']",
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "input",
        attrs: {
          type: "text",
          readonly: ""
        },
        domProps: {
          value: fileObj.animation
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(fileObj, "animation", $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex",
          "margin-left": "2px"
        }
      }, [ _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.changeFile(fileObj.animation, "animations").then(function(result) {
              return fileObj.animation = result;
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fas fa-exchange-alt"
      }) ]), _vm._v(" "), _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.removeFile(fileObj.animation, function() {
              return fileObj.animation = "";
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fa-solid fa-trash-can"
      }) ]) ]) ]), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex"
        }
      }, [ _c("p", {
        staticClass: "li-text"
      }, [ _vm._v(" " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.other.controller"))) ]), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model.trim",
          value: fileObj.controller,
          expression: "fileObj['controller']",
          modifiers: {
            trim: !0
          }
        } ],
        staticClass: "input",
        attrs: {
          type: "text",
          readonly: ""
        },
        domProps: {
          value: fileObj.controller
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(fileObj, "controller", $event.target.value.trim());
          },
          blur: function($event) {
            return _vm.$forceUpdate();
          }
        }
      }), _vm._v(" "), _c("div", {
        staticStyle: {
          display: "flex",
          "margin-left": "2px"
        }
      }, [ _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.changeFile(fileObj.controller, "controller").then(function(result) {
              return fileObj.controller = result;
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fas fa-exchange-alt"
      }) ]), _vm._v(" "), _c("button", {
        staticClass: "icon-button",
        on: {
          click: function($event) {
            _vm.removeFile(fileObj.controller, function() {
              return fileObj.controller = "";
            });
          }
        }
      }, [ _c("i", {
        staticClass: "fa-solid fa-trash-can"
      }) ]) ]) ]), _vm._v(" "), _c("button", {
        staticStyle: {
          width: "100%",
          "margin-top": "10px"
        },
        on: {
          click: function($event) {
            return _vm.importModel(fileObj);
          }
        }
      }, [ _vm._v("\n                " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.files.import")) + "\n            ") ]) ]) ]);
    }), _vm._v(" "), _c("button", {
      staticStyle: {
        width: "100%",
        "margin-top": "20px"
      },
      on: {
        click: function($event) {
          return _vm.addNewFile();
        }
      }
    }, [ _vm._v("\n        " + _vm._s(_vm.tl("menu.ysm_utils.add_new_model")) + "\n    ") ]) ], 2);
  },
  staticRenderFns: []
}, function(inject) {
  inject && inject("data-v-2be87d1e_0", {
    source: ".new-author[data-v-2be87d1e]{width:100%;overflow-y:auto;padding:10px 20px}.new-author-item[data-v-2be87d1e]{height:100%;width:100%;margin-top:10px}.title[data-v-2be87d1e]{margin:0;padding:0;font-size:large}.desc[data-v-2be87d1e]{margin:0;padding:0;color:#6a6a6d}.li-text[data-v-2be87d1e]{width:20%;margin-top:7px;font-size:15px;color:#8b8b8d}.input[data-v-2be87d1e]{flex:1;border-radius:1px;margin-top:5px;padding:2px 2px 2px 5px;height:30px;font-size:15px;background-color:#1c2026;border-style:solid;border-width:1px;border-color:#181a1f}.li-item[data-v-2be87d1e]{margin-top:5px;margin-bottom:5px;padding:10px;border-radius:2px;border-style:solid;border-width:1px;border-color:rgb(24,26,31,.5);box-shadow:0 2px 12px 0 rgba(0,0,0,.3)}.icon-button[data-v-2be87d1e]{margin:2px;padding:0;width:40px;min-width:30px;line-height:.5}.icon-button>i[data-v-2be87d1e]{font-size:large;margin-left:4px}.file-delete[data-v-2be87d1e]{position:relative;width:100%;height:20px}.file-delete>i[data-v-2be87d1e]{position:absolute;top:0;right:0;font-size:x-large}.file-delete>i[data-v-2be87d1e]:hover{color:#ef3636}",
    map: void 0,
    media: void 0
  });
}, {
  props: {
    importModelMenuDialog: {
      type: Object,
      required: !0
    },
    ysmJson: {
      type: Object,
      required: !0
    },
    type: {
      type: String,
      required: !0
    },
    packDirectory: {
      type: Object,
      required: !0
    }
  },
  data: () => ({}),
  methods: {
    join: path.join,
    tl: tl,
    changeFile: async function(pathValue, defaultDir, extension = "json") {
      return changeCurrentFile(this.packDirectory, pathValue, defaultDir, extension);
    },
    changeImgFile: async function(pathValue, defaultDir) {
      return changeCurrentFileWithFilters(this.packDirectory, pathValue, defaultDir, [ {
        extensions: SUPPORTED_IMAGE_TYPES,
        name: "png, avif, webp, jpeg, jpg"
      } ]);
    },
    removeFile: function(pathValue, callback) {
      removeCurrentFile(this.packDirectory, pathValue, callback);
    },
    importModel: function(file) {
      this.importModelMenuDialog.onCancel() && function(packDir, file, dialog, config = {}) {
        let model = file.model;
        if (!model || 0 === model.length) return void showMissingFieldTip("model");
        let modelPath = path.join(packDir, model);
        fs.existsSync(modelPath) ? Blockbench.readFile([ modelPath ], JSON_OPTIONS, files => {
          loadModelFile(files[0]), importTexture(file, packDir, dialog, config);
        }) : showMissingFileTip(modelPath);
      }(this.packDirectory, file, this.importModelMenuDialog, {
        load_animation: !0
      });
    },
    addNewFile: function() {
      let entityModels = this.ysmJson.files[this.type] ?? [];
      entityModels.push({
        match: [ "" ],
        model: "",
        texture: {
          uv: "",
          normal: "",
          specular: ""
        },
        animation: "",
        controller: ""
      }), this.ysmJson.files[this.type] = entityModels, this.$forceUpdate();
    },
    deleteCurrentFile: function(files, index) {
      let file = files[index], deleteFiles = [];
      for (let value of Object.values(file)) if ("string" == typeof value) {
        let filePath = path.join(this.packDirectory, value);
        value.length > 0 && fs.existsSync(filePath) && deleteFiles.push(filePath);
      } else if ("object" == typeof value) for (let subValue of Object.values(value)) if ("string" == typeof subValue) {
        let filePath = path.join(this.packDirectory, subValue);
        subValue.length > 0 && fs.existsSync(filePath) && deleteFiles.push(filePath);
      }
      if (deleteFiles.length <= 0) return void this.$delete(files, index);
      let showMessage = tl("menu.ysm_utils.load_info_menu.files.delete_files.tip");
      deleteFiles.forEach(name => {
        name.length > 0 && (showMessage += `<br> ${name}`);
      }), Blockbench.showMessageBox({
        icon: "fa-warning",
        title: tl("level.ysm_utils.warning"),
        message: showMessage,
        buttons: [ tl("dialog.confirm"), tl("dialog.cancel") ],
        confirm: 0,
        cancel: 1
      }, button => {
        if (0 === button) {
          for (let file of deleteFiles) ysmCommunityNative.shell.trashItem(file);
          this.$delete(files, index);
        }
      });
    }
  },
  computed: {}
}, "data-v-2be87d1e", 0, 0, 0, createInjector);

function writeLanguageFile(locale, filePath, translations) {
  fs.existsSync(filePath) || fs.mkdirSync(filePath, {
    recursive: !0
  }), Object.keys(translations).forEach(key => {
    var str;
    (!(str = translations[key]) || "string" == typeof str && "" === str.trim()) && delete translations[key];
  }), 0 !== Object.keys(translations).length && fs.writeFileSync(path.join(filePath, `${locale}.json`), autoStringify(translations));
}

function getLanguageMap(ysmJson) {
  let langMap = {}, buttonNames = {}, metadata = ysmJson.metadata ?? {};
  langMap["metadata.name"] = metadata.name ?? "", langMap["metadata.tips"] = metadata.tips ?? "";
  let authors = metadata.authors ?? [];
  Array.isArray(authors) && authors.forEach((author, index) => {
    let prefix = `metadata.authors.${index}`;
    langMap[`${prefix}.name`] = author.name ?? "", langMap[`${prefix}.role`] = author.role ?? "", 
    langMap[`${prefix}.comment`] = author.comment ?? "";
  });
  let properties = ysmJson.properties ?? {}, extraAnimation = properties.extra_animation ?? {};
  "object" == typeof extraAnimation && Object.keys(extraAnimation).forEach(key => {
    let prefix = `properties.extra_animation.${key}`;
    langMap[prefix] = extraAnimation[key] ?? "", langMap[`${prefix}.desc`] = "";
  }), (properties.extra_animation_classify ?? []).forEach(classify => {
    let subExtraAnimation = classify.extra_animation;
    Object.keys(subExtraAnimation).forEach(key => {
      let prefix = `properties.extra_animation.${key}`;
      langMap[prefix] = subExtraAnimation[key] ?? "", langMap[`${prefix}.desc`] = "";
    });
  });
  let extraAnimationButtons = properties.extra_animation_buttons ?? [];
  Array.isArray(extraAnimationButtons) && extraAnimationButtons.forEach((button, index) => function(button, buttonNames, langMap) {
    let buttonId = button.id, configForms = button.config_forms;
    if ("string" != typeof buttonId || !Array.isArray(configForms)) return;
    "string" == typeof button.name && (buttonNames[buttonId] = button.name);
    let prefix = `properties.extra_animation_buttons.${buttonId}.config_forms`;
    configForms.forEach((config, configIndex) => {
      "string" == typeof config.title && (langMap[`${prefix}.${configIndex}.title`] = config.title), 
      "string" == typeof config.description && (langMap[`${prefix}.${configIndex}.description`] = config.description), 
      "object" == typeof config.labels && Object.entries(config.labels).forEach(([key, value], index) => {
        langMap[`${prefix}.${configIndex}.labels.${index}`] = key;
      });
    });
  }(button, buttonNames, langMap)), Object.entries(buttonNames).forEach(([buttonId, buttonName]) => {
    let targetValue = `#${buttonId}`, matchers = Object.entries(langMap).filter(([key, value]) => value === targetValue).map(([key]) => key);
    matchers.forEach(key => {
      langMap[key] = buttonName;
    });
  });
  let texture = ((ysmJson.files ?? {}).player ?? {}).texture ?? [];
  return Array.isArray(texture) && texture.forEach((element, index) => {
    if ("string" == typeof element) {
      let textureName = pathToName(element, !1);
      langMap[`files.player.texture.${textureName}`] = textureName;
    } else if ("object" == typeof element && "string" == typeof element.uv) {
      let textureName = pathToName(element.uv, !1);
      langMap[`files.player.texture.${textureName}`] = textureName;
    }
  }), langMap;
}

var script$1 = {
  props: {
    importModelMenuDialog: {
      type: Object,
      required: !0
    },
    ysmJson: {
      type: Object,
      required: !0
    },
    refLanguageMaps: {
      type: Object,
      required: !0
    },
    packDirectory: {
      type: Object,
      required: !0
    }
  },
  mounted() {
    this.getCurrentLanguageMaps();
  },
  data: () => ({
    language: "en_us",
    clickKey: "",
    clickBlurIndex: 0,
    currentLanguageMaps: {},
    availableLanguages: [ "en_us", "zh_cn", "zh_tw", "ru_ru", "ja_jp", "ko_kr", "vi_vn", "pt_br", "es_es", "id_id", "tr_tr" ],
    colorList: {
      black: {
        code: "§0",
        rgb: "#000000"
      },
      dark_blue: {
        code: "§1",
        rgb: "#0000AA"
      },
      dark_green: {
        code: "§2",
        rgb: "#00AA00"
      },
      dark_aqua: {
        code: "§3",
        rgb: "#00AAAA"
      },
      dark_red: {
        code: "§4",
        rgb: "#AA0000"
      },
      dark_purple: {
        code: "§5",
        rgb: "#AA00AA"
      },
      gold: {
        code: "§6",
        rgb: "#FFAA00"
      },
      gray: {
        code: "§7",
        rgb: "#AAAAAA"
      },
      dark_gray: {
        code: "§8",
        rgb: "#555555"
      },
      blue: {
        code: "§9",
        rgb: "#5555FF"
      },
      green: {
        code: "§a",
        rgb: "#55FF55"
      },
      aqua: {
        code: "§b",
        rgb: "#55FFFF"
      },
      red: {
        code: "§c",
        rgb: "#FF5555"
      },
      light_purple: {
        code: "§d",
        rgb: "#FF55FF"
      },
      yellow: {
        code: "§e",
        rgb: "#FFFF55"
      },
      white: {
        code: "§f",
        rgb: "#FFFFFF"
      }
    }
  }),
  methods: {
    tl: tl,
    saveLanguageButton: function() {
      let langPath = path.join(this.packDirectory, this.ysmJson.language_path ?? "lang");
      writeLanguageFile(this.language, langPath, this.currentLanguageMaps), Blockbench.showQuickMessage(tl("menu.ysm_utils.save_success"), 3e3);
    },
    clickLanguageButton: function(language) {
      if (this.language !== language) {
        let oldLangPath = path.join(this.packDirectory, this.ysmJson.language_path ?? "lang");
        writeLanguageFile(this.language, oldLangPath, this.currentLanguageMaps);
      }
      this.language = language, this.getCurrentLanguageMaps();
    },
    getCurrentLanguageMaps: function() {
      let currentLangPath = path.join(this.packDirectory, this.ysmJson.language_path ?? "lang"), languageMaps = {};
      !function(locale, filePath, translations) {
        let langFile = path.join(filePath, `${locale}.json`);
        if (!fs.existsSync(langFile) || !fs.statSync(langFile).isFile()) return;
        let data = autoParseJSON(fs.readFileSync(langFile, {
          encoding: "utf8"
        }));
        Object.entries(data).forEach(([key, value]) => {
          "string" == typeof value && (translations[key] = value);
        });
      }(this.language, currentLangPath, languageMaps), this.currentLanguageMaps = languageMaps;
    },
    addColorCode: function(code, key) {
      this.addStyleCode(code, key);
    },
    addStyleCode: function(code, key) {
      let rawText = this.currentLanguageMaps[key] ?? "";
      this.currentLanguageMaps[key] = rawText.slice(0, this.clickBlurIndex) + code + rawText.slice(this.clickBlurIndex), 
      this.$forceUpdate();
    },
    copyText: function(key) {
      let rawText = this.currentLanguageMaps[key] ?? "", copyText = this.refLanguageMaps[key] ?? "";
      this.currentLanguageMaps[key] = rawText.slice(0, this.clickBlurIndex) + copyText + rawText.slice(this.clickBlurIndex), 
      this.$forceUpdate();
    },
    getColorCodeName: function(name) {
      return tl(`color.ysm_utils.${name}.name`);
    },
    getClickBlurIndex: function(e) {
      this.clickBlurIndex = e.srcElement.selectionStart;
    }
  },
  computed: {}
};

const __vue_component__$1 = normalizeComponent({
  render: function() {
    var _vm = this, _h = _vm.$createElement, _c = _vm._self._c || _h;
    return _c("div", {
      on: {
        click: function($event) {
          _vm.clickKey = "";
        }
      }
    }, [ _c("div", {
      staticStyle: {
        "margin-bottom": "0",
        "text-align": "center"
      }
    }, _vm._l(_vm.availableLanguages, function(local) {
      return _c("button", {
        staticClass: "language-button",
        class: {
          "language-button-selected": _vm.language === local
        },
        attrs: {
          disabled: _vm.language === local
        },
        on: {
          click: function($event) {
            return _vm.clickLanguageButton(local);
          }
        }
      }, [ _vm._v(_vm._s(_vm.tl("dialog.ysm_utils.language_edit.language." + local)) + "\n        ") ]);
    }), 0), _vm._v(" "), _c("div", {
      staticStyle: {
        height: "600px",
        "overflow-y": "auto"
      }
    }, _vm._l(_vm.refLanguageMaps, function(value, key) {
      return _c("div", {
        staticClass: "language-edit-element"
      }, [ _c("p", {
        staticClass: "language-edit-element-key"
      }, [ _vm._v(_vm._s(key)) ]), _vm._v(" "), _c("p", {
        staticClass: "language-edit-element-value"
      }, [ _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model",
          value: _vm.refLanguageMaps[key],
          expression: "refLanguageMaps[key]"
        } ],
        staticStyle: {
          width: "100%"
        },
        attrs: {
          type: "text",
          readonly: ""
        },
        domProps: {
          value: _vm.refLanguageMaps[key]
        },
        on: {
          input: function($event) {
            $event.target.composing || _vm.$set(_vm.refLanguageMaps, key, $event.target.value);
          }
        }
      }), _vm._v(" "), _c("i", {
        staticClass: "fas fa-copy add-style",
        on: {
          click: function($event) {
            return _vm.copyText(key);
          }
        }
      }) ]), _vm._v(" "), _c("div", {
        staticClass: "language-edit-element-input",
        on: {
          click: function($event) {
            $event.stopPropagation(), _vm.clickKey = key;
          }
        }
      }, [ _c("div", {
        directives: [ {
          name: "show",
          rawName: "v-show",
          value: _vm.clickKey === key,
          expression: "clickKey===key"
        } ]
      }, [ _vm._l(_vm.colorList, function(color, name) {
        return _c("i", {
          staticClass: "fas fa-square-full add-color",
          style: {
            color: color.rgb
          },
          attrs: {
            title: _vm.getColorCodeName(name)
          },
          on: {
            click: function($event) {
              return _vm.addColorCode(color.code, key);
            }
          }
        });
      }), _vm._v(" "), _c("i", {
        staticClass: "fas fa-bold add-style",
        attrs: {
          title: _vm.tl("style.ysm_utils.bold.name")
        },
        on: {
          click: function($event) {
            return _vm.addStyleCode("§l", key);
          }
        }
      }), _vm._v(" "), _c("i", {
        staticClass: "fas fa-strikethrough add-style",
        attrs: {
          title: _vm.tl("style.ysm_utils.strikethrough.name")
        },
        on: {
          click: function($event) {
            return _vm.addStyleCode("§m", key);
          }
        }
      }), _vm._v(" "), _c("i", {
        staticClass: "fas fa-underline add-style",
        attrs: {
          title: _vm.tl("style.ysm_utils.underline.name")
        },
        on: {
          click: function($event) {
            return _vm.addStyleCode("§n", key);
          }
        }
      }), _vm._v(" "), _c("i", {
        staticClass: "fas fa-italic add-style",
        attrs: {
          title: _vm.tl("style.ysm_utils.italic.name")
        },
        on: {
          click: function($event) {
            return _vm.addStyleCode("§o", key);
          }
        }
      }), _vm._v(" "), _c("i", {
        staticClass: "fas fa-eraser add-style",
        attrs: {
          title: _vm.tl("style.ysm_utils.reset.name")
        },
        on: {
          click: function($event) {
            return _vm.addStyleCode("§r", key);
          }
        }
      }) ], 2), _vm._v(" "), _c("input", {
        directives: [ {
          name: "model",
          rawName: "v-model",
          value: _vm.currentLanguageMaps[key],
          expression: "currentLanguageMaps[key]"
        } ],
        staticStyle: {
          width: "100%"
        },
        attrs: {
          type: "text"
        },
        domProps: {
          value: _vm.currentLanguageMaps[key]
        },
        on: {
          blur: _vm.getClickBlurIndex,
          input: function($event) {
            $event.target.composing || _vm.$set(_vm.currentLanguageMaps, key, $event.target.value);
          }
        }
      }) ]) ]);
    }), 0), _vm._v(" "), _c("div", {
      staticStyle: {
        "margin-top": "20px"
      }
    }, [ _c("button", {
      staticStyle: {
        width: "98%",
        height: "40px",
        "font-size": "20px"
      },
      on: {
        click: _vm.saveLanguageButton
      }
    }, [ _vm._v("\n            " + _vm._s(_vm.tl("dialog.save")) + "\n        ") ]) ]) ]);
  },
  staticRenderFns: []
}, function(inject) {
  inject && inject("data-v-f0c61d58_0", {
    source: ".language-edit-element[data-v-f0c61d58]{background-color:rgba(23,25,29,.95);box-shadow:0 0 10px rgba(24,26,31,.95);width:98%;margin-top:10px;padding:10px;border-radius:3px}.language-button[data-v-f0c61d58]{width:100px;height:50px;margin-left:5px}.language-button-selected[data-v-f0c61d58]{background-color:#2b2d34;height:60px;max-height:60px}.language-edit-element-key[data-v-f0c61d58]{color:#6a6a6d;font-size:small}.language-edit-element-value[data-v-f0c61d58]{color:#aaaaad;font-size:large}.language-edit-element-input[data-v-f0c61d58]{font-size:x-large;color:#f4f3ff;border-color:#2b2b2b;border-top-style:dotted;border-top-width:2px;border-bottom-style:dotted;border-bottom-width:2px}.add-color[data-v-f0c61d58]{border-color:grey;border-width:1px;border-style:solid;margin:2px}.add-color[data-v-f0c61d58]:hover{border-color:red;border-width:1px;border-style:solid}.add-style[data-v-f0c61d58]:hover{color:red}",
    map: void 0,
    media: void 0
  });
}, script$1, "data-v-f0c61d58", 0, 0, 0, createInjector);

function propertiesHandle$1(properties) {
  properties.height_scale ??= .7, properties.width_scale ??= .7, properties.extra_animation ??= {
    extra0: "",
    extra1: "",
    extra2: "",
    extra3: "",
    extra4: "",
    extra5: "",
    extra6: "",
    extra7: ""
  }, function(properties) {
    let extraAnimationClassify = properties.extra_animation_classify ??= [], output = [];
    extraAnimationClassify.forEach(value => {
      isEmptyString(value.id) || output.push(value);
    }), output.length > 0 ? properties.extra_animation_classify = output : delete properties.extra_animation_classify;
  }(properties), function(properties) {
    let extraAnimationButtons = properties.extra_animation_buttons ??= [], output = [];
    extraAnimationButtons.forEach(value => {
      isEmptyString(value.id) || (value.config_forms.forEach(forms => {
        delete forms.uuid, delete forms.tmp_labels, "checkbox" === forms.type && (delete forms.step, 
        delete forms.min, delete forms.max, delete forms.labels), "range" === forms.type && delete forms.labels, 
        "radio" === forms.type && (delete forms.step, delete forms.min, delete forms.max, 
        Object.keys(forms.labels).forEach(key => {
          deleteField(forms.labels, key);
        }));
      }), output.push(value));
    }), output.length > 0 ? properties.extra_animation_buttons = output : delete properties.extra_animation_buttons;
  }(properties), properties.preview_animation ??= "idle", deleteField(properties, "default_texture"), 
  properties.free ??= !1, properties.render_layers_first ??= !1, deleteField(properties, "gui_foreground"), 
  deleteField(properties, "gui_background"), properties.gui_foreground && (properties.gui_foreground = properties.gui_foreground.replaceAll("\\", "/")), 
  properties.gui_background && (properties.gui_background = properties.gui_background.replaceAll("\\", "/"));
}

function playerHandle$1(files) {
  let player = files.player ?? {}, playerModel = player.model ??= {};
  playerModel.main ??= "", playerModel.arm ??= "", objSeparatorReplace(playerModel), 
  player.animation ??= {}, objSeparatorReplace(player.animation), deleteObject(player, "animation"), 
  player.animation_controllers ??= [], player.animation_controllers = player.animation_controllers.map(value => "string" != typeof value || isEmptyString(value) ? null : value.replaceAll("\\", "/")).filter(item => null != item), 
  player.animation_controllers.length <= 0 && delete player.animation_controllers, 
  player.texture ??= [], player.texture = player.texture.map(value => "string" != typeof value || isEmptyString(value) ? (deleteField(value, "uv"), 
  deleteField(value, "normal"), deleteField(value, "specular"), value) : {
    uv: value
  }).filter(item => (item = item ?? {}, Object.values(item).length > 0)), function(textures) {
    for (let texture of textures) textureSeparatorReplace(texture);
  }(player.texture);
}

function otherFilesHandle$1(files) {
  Object.values(files).forEach(file => {
    if (objSeparatorReplace(file), file.texture && textureSeparatorReplace(file.texture), 
    file && file.texture && deleteObject(file, "texture"), file.match) {
      let match = [];
      file.match.forEach(key => {
        isEmptyString(key) || match.push(key);
      }), file.match = match;
    }
  }), Object.keys(files).forEach(key => {
    deleteObject(files, key);
    let value = files[key];
    value && (!value.match || value.match.length <= 0) && delete files[key];
  });
}

function saveNormalization(ysmJson, ysmJsonPath) {
  ysmJson.spec = 2, function(metadata) {
    if (isEmptyString(metadata.name) && (metadata.name = "<Unknown>"), isEmptyString(metadata.tips) && (metadata.tips = "<Unknown>"), 
    metadata.license ??= {
      type: "All Rights Reserved"
    }, metadata.license) {
      let license = metadata.license;
      isEmptyString(license.type) && (license.type = "All Rights Reserved"), deleteField(license, "desc"), 
      isEmptyString(license.desc) && delete license.desc;
    }
    metadata.authors ??= [], metadata.authors.forEach(author => {
      author.name ??= "<Unknown>", deleteField(author, "avatar"), deleteField(author, "role"), 
      deleteObject(author, "contact"), deleteField(author, "comment");
    }), metadata.authors.length <= 0 && (metadata.authors = [ {
      name: "<Unknown>"
    } ]), metadata.link ??= {}, deleteObject(metadata, "link");
  }(ysmJson.metadata ??= {}), propertiesHandle$1(ysmJson.properties ??= {});
  let files = ysmJson.files ??= {};
  playerHandle$1(files);
  let projectiles = files.projectiles ??= [], vehicles = files.vehicles ??= [];
  return otherFilesHandle$1(projectiles), otherFilesHandle$1(vehicles), deleteObject(files, "projectiles"), 
  deleteObject(files, "vehicles"), function(files) {
    files.sound_path && "sounds" === files.sound_path && delete files.sound_path, files.function_path && "functions" === files.function_path && delete files.function_path, 
    files.language_path && "lang" === files.language_path && delete files.language_path;
  }(files), ysmJson;
}

function textureSeparatorReplace(texture) {
  (texture = texture ?? {}).uv && (texture.uv = texture.uv.replaceAll("\\", "/")), 
  texture.normal && (texture.normal = texture.normal.replaceAll("\\", "/")), texture.specular && (texture.specular = texture.specular.replaceAll("\\", "/"));
}

function objSeparatorReplace(obj) {
  for (let key in obj) "string" == typeof obj[key] && (obj[key] = obj[key].replaceAll("\\", "/"));
}

function deleteObject(obj, fieldName) {
  Object.keys(obj[fieldName]).forEach(key => {
    deleteField(obj[fieldName], key);
  }), Object.keys(obj[fieldName]).length <= 0 && delete obj[fieldName];
}

function deleteField(obj, fieldName) {
  isEmptyString(obj[fieldName]) && delete obj[fieldName];
}

function isEmptyString(str) {
  return !str || "string" == typeof str && "" === str.trim();
}

var unicode = {
  Space_Separator: /[\u1680\u2000-\u200A\u202F\u205F\u3000]/,
  ID_Start: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/,
  ID_Continue: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
}, util = {
  isSpaceSeparator: c => "string" == typeof c && unicode.Space_Separator.test(c),
  isIdStartChar: c => "string" == typeof c && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || "$" === c || "_" === c || unicode.ID_Start.test(c)),
  isIdContinueChar: c => "string" == typeof c && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || "$" === c || "_" === c || "‌" === c || "‍" === c || unicode.ID_Continue.test(c)),
  isDigit: c => "string" == typeof c && /[0-9]/.test(c),
  isHexDigit: c => "string" == typeof c && /[0-9A-Fa-f]/.test(c)
};

let source, parseState, stack, pos, line, column, token, key, root;

function internalize(holder, name, reviver) {
  const value = holder[name];
  if (null != value && "object" == typeof value) if (Array.isArray(value)) for (let i = 0; i < value.length; i++) {
    const key = String(i), replacement = internalize(value, key, reviver);
    void 0 === replacement ? delete value[key] : Object.defineProperty(value, key, {
      value: replacement,
      writable: !0,
      enumerable: !0,
      configurable: !0
    });
  } else for (const key in value) {
    const replacement = internalize(value, key, reviver);
    void 0 === replacement ? delete value[key] : Object.defineProperty(value, key, {
      value: replacement,
      writable: !0,
      enumerable: !0,
      configurable: !0
    });
  }
  return reviver.call(holder, name, value);
}

let lexState, buffer, doubleQuote, sign, c;

function lex() {
  for (lexState = "default", buffer = "", doubleQuote = !1, sign = 1; ;) {
    c = peek();
    const token = lexStates[lexState]();
    if (token) return token;
  }
}

function peek() {
  if (source[pos]) return String.fromCodePoint(source.codePointAt(pos));
}

function read() {
  const c = peek();
  return "\n" === c ? (line++, column = 0) : c ? column += c.length : column++, c && (pos += c.length), 
  c;
}

const lexStates = {
  default() {
    switch (c) {
     case "\t":
     case "\v":
     case "\f":
     case " ":
     case " ":
     case "\ufeff":
     case "\n":
     case "\r":
     case "\u2028":
     case "\u2029":
      return void read();

     case "/":
      return read(), void (lexState = "comment");

     case void 0:
      return read(), newToken("eof");
    }
    if (!util.isSpaceSeparator(c)) return lexStates[parseState]();
    read();
  },
  comment() {
    switch (c) {
     case "*":
      return read(), void (lexState = "multiLineComment");

     case "/":
      return read(), void (lexState = "singleLineComment");
    }
    throw invalidChar(read());
  },
  multiLineComment() {
    switch (c) {
     case "*":
      return read(), void (lexState = "multiLineCommentAsterisk");

     case void 0:
      throw invalidChar(read());
    }
    read();
  },
  multiLineCommentAsterisk() {
    switch (c) {
     case "*":
      return void read();

     case "/":
      return read(), void (lexState = "default");

     case void 0:
      throw invalidChar(read());
    }
    read(), lexState = "multiLineComment";
  },
  singleLineComment() {
    switch (c) {
     case "\n":
     case "\r":
     case "\u2028":
     case "\u2029":
      return read(), void (lexState = "default");

     case void 0:
      return read(), newToken("eof");
    }
    read();
  },
  value() {
    switch (c) {
     case "{":
     case "[":
      return newToken("punctuator", read());

     case "n":
      return read(), literal("ull"), newToken("null", null);

     case "t":
      return read(), literal("rue"), newToken("boolean", !0);

     case "f":
      return read(), literal("alse"), newToken("boolean", !1);

     case "-":
     case "+":
      return "-" === read() && (sign = -1), void (lexState = "sign");

     case ".":
      return buffer = read(), void (lexState = "decimalPointLeading");

     case "0":
      return buffer = read(), void (lexState = "zero");

     case "1":
     case "2":
     case "3":
     case "4":
     case "5":
     case "6":
     case "7":
     case "8":
     case "9":
      return buffer = read(), void (lexState = "decimalInteger");

     case "I":
      return read(), literal("nfinity"), newToken("numeric", 1 / 0);

     case "N":
      return read(), literal("aN"), newToken("numeric", NaN);

     case '"':
     case "'":
      return doubleQuote = '"' === read(), buffer = "", void (lexState = "string");
    }
    throw invalidChar(read());
  },
  identifierNameStartEscape() {
    if ("u" !== c) throw invalidChar(read());
    read();
    const u = unicodeEscape();
    switch (u) {
     case "$":
     case "_":
      break;

     default:
      if (!util.isIdStartChar(u)) throw invalidIdentifier();
    }
    buffer += u, lexState = "identifierName";
  },
  identifierName() {
    switch (c) {
     case "$":
     case "_":
     case "‌":
     case "‍":
      return void (buffer += read());

     case "\\":
      return read(), void (lexState = "identifierNameEscape");
    }
    if (!util.isIdContinueChar(c)) return newToken("identifier", buffer);
    buffer += read();
  },
  identifierNameEscape() {
    if ("u" !== c) throw invalidChar(read());
    read();
    const u = unicodeEscape();
    switch (u) {
     case "$":
     case "_":
     case "‌":
     case "‍":
      break;

     default:
      if (!util.isIdContinueChar(u)) throw invalidIdentifier();
    }
    buffer += u, lexState = "identifierName";
  },
  sign() {
    switch (c) {
     case ".":
      return buffer = read(), void (lexState = "decimalPointLeading");

     case "0":
      return buffer = read(), void (lexState = "zero");

     case "1":
     case "2":
     case "3":
     case "4":
     case "5":
     case "6":
     case "7":
     case "8":
     case "9":
      return buffer = read(), void (lexState = "decimalInteger");

     case "I":
      return read(), literal("nfinity"), newToken("numeric", sign * (1 / 0));

     case "N":
      return read(), literal("aN"), newToken("numeric", NaN);
    }
    throw invalidChar(read());
  },
  zero() {
    switch (c) {
     case ".":
      return buffer += read(), void (lexState = "decimalPoint");

     case "e":
     case "E":
      return buffer += read(), void (lexState = "decimalExponent");

     case "x":
     case "X":
      return buffer += read(), void (lexState = "hexadecimal");
    }
    return newToken("numeric", 0 * sign);
  },
  decimalInteger() {
    switch (c) {
     case ".":
      return buffer += read(), void (lexState = "decimalPoint");

     case "e":
     case "E":
      return buffer += read(), void (lexState = "decimalExponent");
    }
    if (!util.isDigit(c)) return newToken("numeric", sign * Number(buffer));
    buffer += read();
  },
  decimalPointLeading() {
    if (util.isDigit(c)) return buffer += read(), void (lexState = "decimalFraction");
    throw invalidChar(read());
  },
  decimalPoint() {
    switch (c) {
     case "e":
     case "E":
      return buffer += read(), void (lexState = "decimalExponent");
    }
    return util.isDigit(c) ? (buffer += read(), void (lexState = "decimalFraction")) : newToken("numeric", sign * Number(buffer));
  },
  decimalFraction() {
    switch (c) {
     case "e":
     case "E":
      return buffer += read(), void (lexState = "decimalExponent");
    }
    if (!util.isDigit(c)) return newToken("numeric", sign * Number(buffer));
    buffer += read();
  },
  decimalExponent() {
    switch (c) {
     case "+":
     case "-":
      return buffer += read(), void (lexState = "decimalExponentSign");
    }
    if (util.isDigit(c)) return buffer += read(), void (lexState = "decimalExponentInteger");
    throw invalidChar(read());
  },
  decimalExponentSign() {
    if (util.isDigit(c)) return buffer += read(), void (lexState = "decimalExponentInteger");
    throw invalidChar(read());
  },
  decimalExponentInteger() {
    if (!util.isDigit(c)) return newToken("numeric", sign * Number(buffer));
    buffer += read();
  },
  hexadecimal() {
    if (util.isHexDigit(c)) return buffer += read(), void (lexState = "hexadecimalInteger");
    throw invalidChar(read());
  },
  hexadecimalInteger() {
    if (!util.isHexDigit(c)) return newToken("numeric", sign * Number(buffer));
    buffer += read();
  },
  string() {
    switch (c) {
     case "\\":
      return read(), void (buffer += function() {
        switch (peek()) {
         case "b":
          return read(), "\b";

         case "f":
          return read(), "\f";

         case "n":
          return read(), "\n";

         case "r":
          return read(), "\r";

         case "t":
          return read(), "\t";

         case "v":
          return read(), "\v";

         case "0":
          if (read(), util.isDigit(peek())) throw invalidChar(read());
          return "\0";

         case "x":
          return read(), function() {
            let buffer = "", c = peek();
            if (!util.isHexDigit(c)) throw invalidChar(read());
            if (buffer += read(), c = peek(), !util.isHexDigit(c)) throw invalidChar(read());
            return buffer += read(), String.fromCodePoint(parseInt(buffer, 16));
          }();

         case "u":
          return read(), unicodeEscape();

         case "\n":
         case "\u2028":
         case "\u2029":
          return read(), "";

         case "\r":
          return read(), "\n" === peek() && read(), "";

         case "1":
         case "2":
         case "3":
         case "4":
         case "5":
         case "6":
         case "7":
         case "8":
         case "9":
         case void 0:
          throw invalidChar(read());
        }
        return read();
      }());

     case '"':
      return doubleQuote ? (read(), newToken("string", buffer)) : void (buffer += read());

     case "'":
      return doubleQuote ? void (buffer += read()) : (read(), newToken("string", buffer));

     case "\n":
     case "\r":
      throw invalidChar(read());

     case "\u2028":
     case "\u2029":
      !function(c) {
        console.warn(`JSON5: '${formatChar(c)}' in strings is not valid ECMAScript; consider escaping`);
      }(c);
      break;

     case void 0:
      throw invalidChar(read());
    }
    buffer += read();
  },
  start() {
    switch (c) {
     case "{":
     case "[":
      return newToken("punctuator", read());
    }
    lexState = "value";
  },
  beforePropertyName() {
    switch (c) {
     case "$":
     case "_":
      return buffer = read(), void (lexState = "identifierName");

     case "\\":
      return read(), void (lexState = "identifierNameStartEscape");

     case "}":
      return newToken("punctuator", read());

     case '"':
     case "'":
      return doubleQuote = '"' === read(), void (lexState = "string");
    }
    if (util.isIdStartChar(c)) return buffer += read(), void (lexState = "identifierName");
    throw invalidChar(read());
  },
  afterPropertyName() {
    if (":" === c) return newToken("punctuator", read());
    throw invalidChar(read());
  },
  beforePropertyValue() {
    lexState = "value";
  },
  afterPropertyValue() {
    switch (c) {
     case ",":
     case "}":
      return newToken("punctuator", read());
    }
    throw invalidChar(read());
  },
  beforeArrayValue() {
    if ("]" === c) return newToken("punctuator", read());
    lexState = "value";
  },
  afterArrayValue() {
    switch (c) {
     case ",":
     case "]":
      return newToken("punctuator", read());
    }
    throw invalidChar(read());
  },
  end() {
    throw invalidChar(read());
  }
};

function newToken(type, value) {
  return {
    type: type,
    value: value,
    line: line,
    column: column
  };
}

function literal(s) {
  for (const c of s) {
    if (peek() !== c) throw invalidChar(read());
    read();
  }
}

function unicodeEscape() {
  let buffer = "", count = 4;
  for (;count-- > 0; ) {
    const c = peek();
    if (!util.isHexDigit(c)) throw invalidChar(read());
    buffer += read();
  }
  return String.fromCodePoint(parseInt(buffer, 16));
}

const parseStates = {
  start() {
    if ("eof" === token.type) throw invalidEOF();
    push();
  },
  beforePropertyName() {
    switch (token.type) {
     case "identifier":
     case "string":
      return key = token.value, void (parseState = "afterPropertyName");

     case "punctuator":
      return void pop();

     case "eof":
      throw invalidEOF();
    }
  },
  afterPropertyName() {
    if ("eof" === token.type) throw invalidEOF();
    parseState = "beforePropertyValue";
  },
  beforePropertyValue() {
    if ("eof" === token.type) throw invalidEOF();
    push();
  },
  beforeArrayValue() {
    if ("eof" === token.type) throw invalidEOF();
    "punctuator" !== token.type || "]" !== token.value ? push() : pop();
  },
  afterPropertyValue() {
    if ("eof" === token.type) throw invalidEOF();
    switch (token.value) {
     case ",":
      return void (parseState = "beforePropertyName");

     case "}":
      pop();
    }
  },
  afterArrayValue() {
    if ("eof" === token.type) throw invalidEOF();
    switch (token.value) {
     case ",":
      return void (parseState = "beforeArrayValue");

     case "]":
      pop();
    }
  },
  end() {}
};

function push() {
  let value;
  switch (token.type) {
   case "punctuator":
    switch (token.value) {
     case "{":
      value = {};
      break;

     case "[":
      value = [];
    }
    break;

   case "null":
   case "boolean":
   case "numeric":
   case "string":
    value = token.value;
  }
  if (void 0 === root) root = value; else {
    const parent = stack[stack.length - 1];
    Array.isArray(parent) ? parent.push(value) : Object.defineProperty(parent, key, {
      value: value,
      writable: !0,
      enumerable: !0,
      configurable: !0
    });
  }
  if (null !== value && "object" == typeof value) stack.push(value), parseState = Array.isArray(value) ? "beforeArrayValue" : "beforePropertyName"; else {
    const current = stack[stack.length - 1];
    parseState = null == current ? "end" : Array.isArray(current) ? "afterArrayValue" : "afterPropertyValue";
  }
}

function pop() {
  stack.pop();
  const current = stack[stack.length - 1];
  parseState = null == current ? "end" : Array.isArray(current) ? "afterArrayValue" : "afterPropertyValue";
}

function invalidChar(c) {
  return syntaxError(void 0 === c ? `JSON5: invalid end of input at ${line}:${column}` : `JSON5: invalid character '${formatChar(c)}' at ${line}:${column}`);
}

function invalidEOF() {
  return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
}

function invalidIdentifier() {
  return column -= 5, syntaxError(`JSON5: invalid identifier character at ${line}:${column}`);
}

function formatChar(c) {
  const replacements = {
    "'": "\\'",
    '"': '\\"',
    "\\": "\\\\",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "\t": "\\t",
    "\v": "\\v",
    "\0": "\\0",
    "\u2028": "\\u2028",
    "\u2029": "\\u2029"
  };
  if (replacements[c]) return replacements[c];
  if (c < " ") {
    const hexString = c.charCodeAt(0).toString(16);
    return "\\x" + ("00" + hexString).substring(hexString.length);
  }
  return c;
}

function syntaxError(message) {
  const err = new SyntaxError(message);
  return err.lineNumber = line, err.columnNumber = column, err;
}

const JSON5 = {
  parse: function(text, reviver) {
    source = String(text), parseState = "start", stack = [], pos = 0, line = 1, column = 0, 
    token = void 0, key = void 0, root = void 0;
    do {
      token = lex(), parseStates[parseState]();
    } while ("eof" !== token.type);
    return "function" == typeof reviver ? internalize({
      "": root
    }, "", reviver) : root;
  },
  stringify: function(value, replacer, space) {
    const stack = [];
    let propertyList, replacerFunc, quote, indent = "", gap = "";
    if (null == replacer || "object" != typeof replacer || Array.isArray(replacer) || (space = replacer.space, 
    quote = replacer.quote, replacer = replacer.replacer), "function" == typeof replacer) replacerFunc = replacer; else if (Array.isArray(replacer)) {
      propertyList = [];
      for (const v of replacer) {
        let item;
        "string" == typeof v ? item = v : ("number" == typeof v || v instanceof String || v instanceof Number) && (item = String(v)), 
        void 0 !== item && propertyList.indexOf(item) < 0 && propertyList.push(item);
      }
    }
    return space instanceof Number ? space = Number(space) : space instanceof String && (space = String(space)), 
    "number" == typeof space ? space > 0 && (space = Math.min(10, Math.floor(space)), 
    gap = "          ".substr(0, space)) : "string" == typeof space && (gap = space.substr(0, 10)), 
    serializeProperty("", {
      "": value
    });
    function serializeProperty(key, holder) {
      let value = holder[key];
      switch (null != value && ("function" == typeof value.toJSON5 ? value = value.toJSON5(key) : "function" == typeof value.toJSON && (value = value.toJSON(key))), 
      replacerFunc && (value = replacerFunc.call(holder, key, value)), value instanceof Number ? value = Number(value) : value instanceof String ? value = String(value) : value instanceof Boolean && (value = value.valueOf()), 
      value) {
       case null:
        return "null";

       case !0:
        return "true";

       case !1:
        return "false";
      }
      return "string" == typeof value ? quoteString(value) : "number" == typeof value ? String(value) : "object" == typeof value ? Array.isArray(value) ? function(value) {
        if (stack.indexOf(value) >= 0) throw TypeError("Converting circular structure to JSON5");
        stack.push(value);
        let stepback = indent;
        indent += gap;
        let final, partial = [];
        for (let i = 0; i < value.length; i++) {
          const propertyString = serializeProperty(String(i), value);
          partial.push(void 0 !== propertyString ? propertyString : "null");
        }
        if (0 === partial.length) final = "[]"; else if ("" === gap) {
          final = "[" + partial.join(",") + "]";
        } else {
          let separator = ",\n" + indent, properties = partial.join(separator);
          final = "[\n" + indent + properties + ",\n" + stepback + "]";
        }
        return stack.pop(), indent = stepback, final;
      }(value) : function(value) {
        if (stack.indexOf(value) >= 0) throw TypeError("Converting circular structure to JSON5");
        stack.push(value);
        let stepback = indent;
        indent += gap;
        let final, keys = propertyList || Object.keys(value), partial = [];
        for (const key of keys) {
          const propertyString = serializeProperty(key, value);
          if (void 0 !== propertyString) {
            let member = serializeKey(key) + ":";
            "" !== gap && (member += " "), member += propertyString, partial.push(member);
          }
        }
        if (0 === partial.length) final = "{}"; else {
          let properties;
          if ("" === gap) properties = partial.join(","), final = "{" + properties + "}"; else {
            let separator = ",\n" + indent;
            properties = partial.join(separator), final = "{\n" + indent + properties + ",\n" + stepback + "}";
          }
        }
        return stack.pop(), indent = stepback, final;
      }(value) : void 0;
    }
    function quoteString(value) {
      const quotes = {
        "'": .1,
        '"': .2
      }, replacements = {
        "'": "\\'",
        '"': '\\"',
        "\\": "\\\\",
        "\b": "\\b",
        "\f": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "\t": "\\t",
        "\v": "\\v",
        "\0": "\\0",
        "\u2028": "\\u2028",
        "\u2029": "\\u2029"
      };
      let product = "";
      for (let i = 0; i < value.length; i++) {
        const c = value[i];
        switch (c) {
         case "'":
         case '"':
          quotes[c]++, product += c;
          continue;

         case "\0":
          if (util.isDigit(value[i + 1])) {
            product += "\\x00";
            continue;
          }
        }
        if (replacements[c]) product += replacements[c]; else {
          if (c < " ") {
            let hexString = c.charCodeAt(0).toString(16);
            product += "\\x" + ("00" + hexString).substring(hexString.length);
            continue;
          }
          product += c;
        }
      }
      const quoteChar = quote || Object.keys(quotes).reduce((a, b) => quotes[a] < quotes[b] ? a : b);
      return product = product.replace(new RegExp(quoteChar, "g"), replacements[quoteChar]), 
      quoteChar + product + quoteChar;
    }
    function serializeKey(key) {
      if (0 === key.length) return quoteString(key);
      const firstChar = String.fromCodePoint(key.codePointAt(0));
      if (!util.isIdStartChar(firstChar)) return quoteString(key);
      for (let i = firstChar.length; i < key.length; i++) if (!util.isIdContinueChar(String.fromCodePoint(key.codePointAt(i)))) return quoteString(key);
      return key;
    }
  }
};

var lib = JSON5;

function oldOtherFilesHandle(files) {
  if ("object" == typeof (files = files ?? []) && !Array.isArray(files)) {
    let newFiles = [];
    return Object.entries(files).forEach(([key, value]) => {
      value.match = [ key ], newFiles.push(value);
    }), newFiles;
  }
  return files;
}

function otherFilesHandle(files) {
  files.forEach(file => {
    file.model ??= "", file.texture ??= {}, file.animation ??= "", file.controller ??= "";
    let texture = file.texture;
    "string" == typeof texture ? file.texture = {
      uv: texture,
      normal: "",
      specular: ""
    } : (texture.uv ??= "", texture.normal ??= "", texture.specular ??= "");
  });
}

function readYsmFile(packDirectory) {
  let ysmJson, ysmJsonPath = path.join(packDirectory, "ysm.json"), content = fs.readFileSync(ysmJsonPath, "utf8");
  try {
    ysmJson = lib.parse(content);
  } catch (err) {
    return console.error(err), void autoParseJSON(content, !0);
  }
  return function(path) {
    let cacheYsmFolders = localStorage.getItem("cacheYsmFolders");
    cacheYsmFolders = cacheYsmFolders && cacheYsmFolders.length ? JSON.parse(cacheYsmFolders) : {};
    let name = pathToName(path, !0);
    if (cacheYsmFolders[name] && cacheYsmFolders[name].length) return;
    cacheYsmFolders[name] = path, localStorage.setItem("cacheYsmFolders", JSON.stringify(cacheYsmFolders)), 
    addCacheYsmFoldersAction(name, path);
  }(packDirectory), function(ysmJson) {
    ysmJson.spec = 2, metadata = ysmJson.metadata ??= {}, metadata.name ??= "", metadata.tips ??= "", 
    metadata.license ??= {
      type: "All Rights Reserved",
      "desc:": ""
    }, metadata.license.type ??= "All Rights Reserved", metadata.license.desc ??= "", 
    metadata.authors ??= [], metadata.authors.forEach(author => {
      author.name ??= "", author.avatar ??= "", author.role ??= "", author.contact ??= {}, 
      author.comment ??= "";
    }), metadata.link ??= {
      home: "",
      donate: ""
    }, metadata.link.home ??= "", metadata.link.donate ??= "", properties = ysmJson.properties ??= {}, 
    properties.height_scale ??= .7, properties.width_scale ??= .7, properties.extra_animation ??= {
      extra0: "",
      extra1: "",
      extra2: "",
      extra3: "",
      extra4: "",
      extra5: "",
      extra6: "",
      extra7: ""
    }, properties.extra_animation_classify ??= [], properties.extra_animation_buttons ??= [], 
    properties.preview_animation ??= "idle", properties.default_texture ??= "", properties.free ??= !1, 
    properties.render_layers_first ??= !1, properties.disable_preview_rotation ??= !1, 
    properties.all_cutout ??= !1, properties.gui_no_lighting ??= !1, properties.gui_foreground ??= "", 
    properties.gui_background ??= "";
    var properties;
    var metadata;
    let files = ysmJson.files ??= {}, projectiles = files.projectiles = oldOtherFilesHandle(files.projectiles), vehicles = files.vehicles = oldOtherFilesHandle(files.vehicles);
    return files.sound_path ??= "sounds", files.function_path ??= "functions", files.language_path ??= "lang", 
    function(files) {
      let player = files.player ?? {}, playerModel = player.model ??= {};
      playerModel.main ??= "", playerModel.arm ??= "";
      let animation = player.animation ??= {};
      animation.main ??= "", animation.arm ??= "", animation.extra ??= "", animation.tac ??= "", 
      animation.carryon ??= "", animation.swem ??= "", animation.parcool ??= "", animation.slashblade ??= "", 
      animation.tlm ??= "", player.animation_controllers ??= [], player.texture ??= [], 
      player.texture = player.texture.map(value => "string" == typeof value ? {
        uv: value,
        normal: "",
        specular: ""
      } : (value.uv ??= "", value.normal ??= "", value.specular ??= "", value)), "sound_path" in player && (files.sound_path = player.sound_path, 
      delete player.sound_path);
    }(files), function(files) {
      "arrow" in files && (files.projectiles["minecraft:arrow"] = files.arrow, delete files.arrow);
    }(files), otherFilesHandle(projectiles), otherFilesHandle(vehicles), ysmJson;
  }(ysmJson);
}

function saveYsmFile(ysmJson, ysmJsonPath) {
  let result = autoStringify(saveNormalization(ysmJson));
  fs.writeFileSync(ysmJsonPath, result), Blockbench.showQuickMessage(tl("menu.ysm_utils.save_success"), 3e3);
  // ysm.json 是模型包的一部分（缩放、额外动画、轮盘配置等）。桥接类插件（如 BB Connect）需要知道
  // 配置已经被改写，才能把这次保存排进同步、让游戏端重扫模型目录；没有监听者时这里是空操作。
  // 监听者异常不能让「保存配置」本身失败，所以这里隔离一次。
  if (Blockbench.dispatchEvent) {
    try {
      Blockbench.dispatchEvent("ysm_utils_pack_info_saved", {
        path: path.dirname(ysmJsonPath)
      });
    } catch (err) {
      console.warn("[ysm_utils] pack info listener failed", err);
    }
  }
}

function getSha256(ysmJson) {
  return cryptoLib.createHash("sha256").update(JSON.stringify(ysmJson), "utf8").digest("hex");
}

function openImportDialog(packDirectory) {
  let ysmJsonPath = path.join(packDirectory, "ysm.json"), ysmJson = readYsmFile(packDirectory), sha256Cache = getSha256(ysmJson), refLanguageMaps = getLanguageMap(ysmJson), importModelMenuDialog = new Dialog({
    title: "menu.ysm_utils.load_info_menu.title",
    cancel_on_click_outside: !1,
    width: 1e3,
    confirmIndex: 0,
    cancelIndex: 2,
    buttons: [ tl("menu.ysm_utils.save"), tl("menu.ysm_utils.save_quit"), tl("dialog.close") ],
    onConfirm: formResult => (saveYsmFile(JSON.parse(JSON.stringify(ysmJson)), ysmJsonPath), 
    sha256Cache = getSha256(ysmJson), !1),
    onButton(button_index, event) {
      if (1 === button_index) return saveYsmFile(ysmJson, ysmJsonPath), !0;
    },
    onCancel: function(event) {
      return function(ysmJson, ysmJsonPath, sha256Cache) {
        if (getSha256(ysmJson) === sha256Cache) return !0;
        let button = ysmCommunityNative.dialog.showMessageBoxSync({
          type: "warning",
          title: tl("level.ysm_utils.warning"),
          message: tl("menu.ysm_utils.load_info_menu.save_tip"),
          buttons: [ tl("menu.ysm_utils.save"), tl("menu.ysm_utils.exit_without_save"), tl("dialog.cancel") ]
        });
        return 0 === button ? (saveYsmFile(ysmJson, ysmJsonPath), !0) : 1 === button;
      }(ysmJson, ysmJsonPath, sha256Cache);
    },
    sidebar: {
      pages: {
        metadata: tl("menu.ysm_utils.load_info_menu.sidebar.metadata"),
        properties: tl("menu.ysm_utils.load_info_menu.sidebar.properties"),
        player_files: tl("menu.ysm_utils.load_info_menu.sidebar.player_files"),
        projectile_files: tl("menu.ysm_utils.load_info_menu.sidebar.projectile_files"),
        vehicle_files: tl("menu.ysm_utils.load_info_menu.sidebar.vehicle_files"),
        language: tl("menu.ysm_utils.load_info_menu.sidebar.language")
      },
      page: "metadata",
      actions: [ new Action("ysm_utils.load_info_menu.open_folder", {
        name: "menu.ysm_utils.load_info_menu.open_folder",
        icon: "fa-folder-open",
        click: function() {
          ysmCommunityNative.shell.openPath(packDirectory).then(result => {});
        }
      }) ],
      onPageSwitch(page) {
        importModelMenuDialog.content_vue.type !== page && (importModelMenuDialog.content_vue.type = page);
      }
    },
    component: {
      data: () => ({
        dialogInput: importModelMenuDialog,
        ysmJson: ysmJson,
        packDirectory: packDirectory,
        refLanguageMaps: refLanguageMaps,
        type: "metadata"
      }),
      components: {
        metadataVue: __vue_component__$9,
        propertiesVue: __vue_component__$4,
        playerFilesVue: __vue_component__$3,
        otherFilesVue: __vue_component__$2,
        languageVue: __vue_component__$1
      },
      template: "\n                <div>\n                    <metadataVue v-if=\"this.type==='metadata'\" :import-model-menu-dialog='dialogInput'\n                                 :ysm-json='ysmJson' :pack-directory='packDirectory'/>\n                    <propertiesVue v-if=\"this.type==='properties'\" :import-model-menu-dialog='dialogInput'\n                                   :ysm-json='ysmJson' :pack-directory='packDirectory'/>\n                    <playerFilesVue v-if=\"this.type==='player_files'\" :import-model-menu-dialog='dialogInput'\n                                    :ysm-json='ysmJson' :pack-directory='packDirectory'/>\n                    <otherFilesVue v-if=\"this.type==='projectile_files'\" :import-model-menu-dialog='dialogInput'\n                                   :ysm-json='ysmJson' :type=\"'projectiles'\" :pack-directory='packDirectory'/>\n                    <otherFilesVue v-if=\"this.type==='vehicle_files'\" :import-model-menu-dialog='dialogInput'\n                                   :ysm-json='ysmJson' :type=\"'vehicles'\" :pack-directory='packDirectory'/>\n                    <languageVue v-if=\"this.type==='language'\" :import-model-menu-dialog='dialogInput'\n                                 :ysm-json='ysmJson' :pack-directory='packDirectory'\n                                 :refLanguageMaps='refLanguageMaps'/>\n                </div>"
    }
  });
  importModelMenuDialog.show(), importModelMenuDialog.object && importModelMenuDialog.object.style && (importModelMenuDialog.object.style["max-width"] = "1000px", 
  importModelMenuDialog.object.style["min-height"] = "600px");
}

function checkDirectory(packDirectory) {
  let versionType, ysmJsonPath = path.join(packDirectory, "ysm.json");
  if (fs.existsSync(ysmJsonPath)) return !0;
  let infoJson = path.join(packDirectory, "info.json"), mainJson = path.join(packDirectory, "main.json");
  return fs.existsSync(infoJson) ? versionType = "1.1.5" : fs.existsSync(mainJson) && (versionType = "1.1.4"), 
  versionType ? (Blockbench.showMessageBox({
    icon: "fa-warning",
    title: tl("level.ysm_utils.warning"),
    message: tl("menu.ysm_utils.load_info_menu.transform_model"),
    width: 600,
    buttons: [ tl("dialog.confirm"), tl("dialog.cancel") ],
    confirm: 0,
    cancel: 1
  }, button => {
    0 === button && async function(packDirectory, isVersion114) {
      let result = await ysmCommunityNative.dialog.showOpenDialog({
        title: tl("menu.ysm_utils.old_version_transform.select_output_directory"),
        properties: [ "openDirectory" ]
      });
      if (result.canceled) return;
      let selectFilePaths = result.filePaths;
      return selectFilePaths && selectFilePaths[0] ? oldVersionTransform(packDirectory, selectFilePaths[0], isVersion114) : void 0;
    }(packDirectory, "1.1.4" === versionType).then(result => {
      result && openImportDialog(result);
    });
  }), !1) : (Blockbench.showMessageBox({
    icon: "fa-warning",
    title: tl("level.ysm_utils.error"),
    message: tl("menu.ysm_utils.load_info_menu.directory_error")
  }), !1);
}

const __vue_component__ = normalizeComponent({
  render: function() {
    var _vm = this, _h = _vm.$createElement, _c = _vm._self._c || _h;
    return _c("div", [ _c("div", {
      staticClass: "type-main"
    }, [ _c("div", {
      staticClass: "type-container"
    }, [ _vm.playerMainModelFileExist ? _c("button", {
      staticClass: "type-button",
      on: {
        click: _vm.importMainModel
      }
    }, [ _c("i", {
      staticClass: "fas fa-universal-access fa-5x"
    }), _c("br"), _vm._v("\n                " + _vm._s(_vm.tl("menu.ysm_utils.import_type.player_main")) + "\n            ") ]) : _vm._e(), _vm._v(" "), _vm.playerArmModelFileExist ? _c("button", {
      staticClass: "type-button",
      on: {
        click: _vm.importArmModel
      }
    }, [ _c("i", {
      staticClass: "fas fa-hand-paper fa-5x"
    }), _c("br"), _vm._v("\n                " + _vm._s(_vm.tl("menu.ysm_utils.import_type.player_arm")) + "\n            ") ]) : _vm._e(), _vm._v(" "), _c("button", {
      staticClass: "type-button",
      on: {
        click: _vm.loadInfo
      }
    }, [ _c("i", {
      staticClass: "fas fa-info fa-5x"
    }), _c("br"), _vm._v("\n                " + _vm._s(_vm.tl("menu.ysm_utils.load_info_menu.name")) + "\n            ") ]) ]) ]), _vm._v(" "), _c("div", {
      staticClass: "type-import-div"
    }, [ _c("div", [ _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model",
        value: _vm.importConfig.load_animation,
        expression: "importConfig['load_animation']"
      } ],
      attrs: {
        type: "checkbox"
      },
      domProps: {
        checked: Array.isArray(_vm.importConfig.load_animation) ? _vm._i(_vm.importConfig.load_animation, null) > -1 : _vm.importConfig.load_animation
      },
      on: {
        change: [ function($event) {
          var $$a = _vm.importConfig.load_animation, $$el = $event.target, $$c = !!$$el.checked;
          if (Array.isArray($$a)) {
            var $$i = _vm._i($$a, null);
            $$el.checked ? $$i < 0 && _vm.$set(_vm.importConfig, "load_animation", $$a.concat([ null ])) : $$i > -1 && _vm.$set(_vm.importConfig, "load_animation", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          } else _vm.$set(_vm.importConfig, "load_animation", $$c);
        }, _vm.saveConfig ]
      }
    }), _vm._v(" "), _c("label", [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.direct_import.import_animation"))) ]) ]), _vm._v(" "), _c("div", [ _c("input", {
      directives: [ {
        name: "model",
        rawName: "v-model",
        value: _vm.importConfig.load_animation_controllers,
        expression: "importConfig['load_animation_controllers']"
      } ],
      attrs: {
        type: "checkbox"
      },
      domProps: {
        checked: Array.isArray(_vm.importConfig.load_animation_controllers) ? _vm._i(_vm.importConfig.load_animation_controllers, null) > -1 : _vm.importConfig.load_animation_controllers
      },
      on: {
        change: [ function($event) {
          var $$a = _vm.importConfig.load_animation_controllers, $$el = $event.target, $$c = !!$$el.checked;
          if (Array.isArray($$a)) {
            var $$i = _vm._i($$a, null);
            $$el.checked ? $$i < 0 && _vm.$set(_vm.importConfig, "load_animation_controllers", $$a.concat([ null ])) : $$i > -1 && _vm.$set(_vm.importConfig, "load_animation_controllers", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          } else _vm.$set(_vm.importConfig, "load_animation_controllers", $$c);
        }, _vm.saveConfig ]
      }
    }), _vm._v(" "), _c("label", [ _vm._v(_vm._s(_vm.tl("menu.ysm_utils.direct_import.import_animation_controller"))) ]) ]) ]) ]);
  },
  staticRenderFns: []
}, function(inject) {
  inject && inject("data-v-ba78b836_0", {
    source: ".type-main[data-v-ba78b836]{width:100%;display:flex;justify-content:center;align-items:center}.type-container[data-v-ba78b836]{display:flex;justify-content:space-between}.type-button[data-v-ba78b836]{height:250px;width:150px;margin-top:10px;margin-right:5px;font-size:large}.type-import-div[data-v-ba78b836]{margin-top:10px;margin-right:5px;margin-left:10px;font-size:large}.type-button>i[data-v-ba78b836]{margin-bottom:35px}",
    map: void 0,
    media: void 0
  });
}, {
  props: {
    importTypeMenuDialog: {
      type: Object,
      required: !0
    },
    ysmJson: {
      type: Object,
      required: !0
    },
    packDirectory: {
      type: Object,
      required: !0
    }
  },
  data: () => ({}),
  methods: {
    join: path.join,
    tl: tl,
    importMainModel: function() {
      importMainFile(this.packDirectory, this.ysmJson, this.importTypeMenuDialog, this.importConfig);
    },
    importArmModel: function() {
      importArmFile(this.packDirectory, this.ysmJson, this.importTypeMenuDialog);
    },
    loadInfo: function() {
      openImportDialog(this.packDirectory), this.importTypeMenuDialog.close();
    },
    saveConfig: function() {
      var config;
      config = this.importConfig, localStorage.setItem("cacheYsmImportConfig", JSON.stringify(config));
    }
  },
  computed: {
    playerMainModelFileExist: function() {
      let result = this.ysmJson?.files?.player?.model?.main;
      return result && result.endsWith(".json");
    },
    playerArmModelFileExist: function() {
      let result = this.ysmJson?.files?.player?.model?.arm;
      return result && result.endsWith(".json");
    },
    importConfig: function() {
      return function() {
        let cacheYsmImportConfig = localStorage.getItem("cacheYsmImportConfig");
        return cacheYsmImportConfig && cacheYsmImportConfig.length ? JSON.parse(cacheYsmImportConfig) : {
          load_animation: !0,
          load_animation_controllers: !0
        };
      }();
    }
  }
}, "data-v-ba78b836", 0, 0, 0, createInjector);

let directImportMenuAction = new Action("ysm_utils.direct_import", {
  name: "menu.ysm_utils.direct_import.name",
  icon: "fa-file-import",
  click: function() {
    ysmCommunityNative.dialog.showOpenDialog({
      title: tl("menu.ysm_utils.direct_import.name"),
      properties: [ "openDirectory" ]
    }).then(result => {
      if (result.canceled) return;
      let selectFilePaths = result.filePaths;
      selectFilePaths && selectFilePaths[0] && checkDirectory(selectFilePaths[0]) && openImportTypeDialog(selectFilePaths[0]);
    });
  }
});

function openImportTypeDialog(packDirectory) {
  let ysmJson = readYsmFile(packDirectory), importTypeMenuDialog = new Dialog({
    title: "menu.ysm_utils.direct_import.name",
    cancel_on_click_outside: !1,
    singleButton: !0,
    width: 700,
    component: {
      data: () => ({
        dialogInput: importTypeMenuDialog,
        ysmJson: ysmJson,
        packDirectory: packDirectory
      }),
      components: {
        importTypeVue: __vue_component__
      },
      template: '\n                <importTypeVue :import-type-menu-dialog="dialogInput"\n                               :ysm-json="ysmJson"\n                               :pack-directory="packDirectory"/>'
    }
  });
  importTypeMenuDialog.show();
}

const CACHE_YSM_FOLDERS = [], CACHE_YSM_INFO_ACTION = {
  name: "menu.ysm_utils.cache_info_menu.name",
  id: "ysm_utils.cache_info_menu",
  icon: "fa-history",
  children: function() {
    let arr = [ ...CACHE_YSM_FOLDERS ].reverse();
    return arr.length && arr.push("_", {
      name: tl("menu.ysm_utils.cache_info_menu.clear_all"),
      icon: "clear",
      click: function() {
        localStorage.removeItem("cacheYsmFolders"), CACHE_YSM_FOLDERS.length = 0;
      }
    }), arr;
  }
};

function addCacheYsmFoldersAction(name, desc) {
  CACHE_YSM_FOLDERS.push({
    id: name,
    name: name,
    description: desc,
    icon: "fa-folder",
    click: function() {
      let cacheYsmFolders = localStorage.getItem("cacheYsmFolders");
      if (cacheYsmFolders && cacheYsmFolders.length && (cacheYsmFolders = JSON.parse(cacheYsmFolders), 
      cacheYsmFolders[this.id])) {
        let path = cacheYsmFolders[this.id];
        fs.existsSync(path) && checkDirectory(path) && openImportTypeDialog(path);
      }
    }
  });
}

let currentInfoMenuAction = new Action("ysm_utils.current_info_menu", {
  name: "menu.ysm_utils.current_info_menu.name",
  icon: "fa-circle-info",
  condition: () => !(!Project || !Project?.ysm_project_info?.path),
  click: function() {
    let path = Project ? Project?.ysm_project_info?.path : null;
    fs.existsSync(path) ? openImportDialog(path) : Blockbench.showQuickMessage(tl("menu.ysm_utils.current_info_menu.no_info"), 3e3);
  }
});

async function createAllFiles(selectFilePaths, formResult) {
  let packPath = path.join(selectFilePaths[0], formResult.packName);
  if (fs.existsSync(packPath)) return void ysmCommunityNative.dialog.showMessageBoxSync({
    type: "warning",
    title: tl("level.ysm_utils.warning"),
    message: tl("menu.ysm_utils.create_default_model.same_folder"),
    buttons: [ tl("dialog.cancel") ]
  });
  const {armAnimationJson: armAnimationJson, arrowAnimationJson: arrowAnimationJson, boatAnimationJson: boatAnimationJson, carryonAnimationJson: carryonAnimationJson, extraAnimationJson: extraAnimationJson, mainAnimationJson: mainAnimationJson, fpArmAnimationJson: fpArmAnimationJson, parcoolAnimationJson: parcoolAnimationJson, swemAnimationJson: swemAnimationJson, tacAnimationJson: tacAnimationJson, slashbladeAnimationJson: slashbladeAnimationJson, tlmAnimationJson: tlmAnimationJson, animationControllers: animationControllers, enLanguage: enLanguage, zhLanguage: zhLanguage, armModelJson: armModelJson, arrowModelJson: arrowModelJson, boatModelJson: boatModelJson, fishingBobberModelJson: fishingBobberModelJson, mainModelJson: mainModelJson, minecartJson: minecartJson, ysmJson: ysmJson, arrowTexture: arrowTexture, boatTexture: boatTexture, fishingBobberTexture: fishingBobberTexture, minecartTexture: minecartTexture, blueTexture: blueTexture, defaultTexture: defaultTexture, avatarTexture: avatarTexture, backgroundImg: backgroundImg, foregroundImg: foregroundImg} = await async function() {
    defaultAssetsPromise || (defaultAssetsPromise = (async () => {
      const results = {};
      let next = 0, complete = 0;
      async function worker() {
        for (;next < DEFAULT_ASSET_MANIFEST.length; ) {
          const asset = DEFAULT_ASSET_MANIFEST[next++], response = await fetch("https://raw.githubusercontent.com/YesSteveModel/YSM-Utils-Plugins/" + DEFAULT_ASSET_REVISION + "/assets/default/" + asset.file);
          if (!response.ok) throw new Error("Template download failed: " + asset.file + " (HTTP " + response.status + ")");
          const bytes = Buffer.from(await response.arrayBuffer());
          if (cryptoLib.createHash("sha256").update(bytes).digest("hex") !== asset.sha256) throw new Error("Template integrity check failed: " + asset.file);
          results[asset.name] = asset.file.endsWith(".json") ? JSON.parse(bytes.toString("utf8")) : "data:image/png;base64," + bytes.toString("base64"), 
          Blockbench.showQuickMessage("YSM: loading default templates " + ++complete + "/" + DEFAULT_ASSET_MANIFEST.length, 1e3);
        }
      }
      return await Promise.all(Array.from({
        length: 4
      }, () => worker())), results;
    })().catch(error => {
      throw defaultAssetsPromise = void 0, error;
    }));
    return defaultAssetsPromise;
  }();
  if (fs.existsSync(packPath)) throw new Error("The destination folder already exists.");
  let animations = path.join(packPath, "animations"), avatar = path.join(packPath, "avatar"), models = path.join(packPath, "models"), textures = path.join(packPath, "textures"), sounds = path.join(packPath, "sounds"), controller = path.join(packPath, "controller"), functions = path.join(packPath, "functions"), lang = path.join(packPath, "lang"), gui = path.join(textures, "gui");
  fs.mkdirSync(packPath, {
    recursive: !0
  }), fs.mkdirSync(animations, {
    recursive: !0
  }), fs.mkdirSync(avatar, {
    recursive: !0
  }), fs.mkdirSync(models, {
    recursive: !0
  }), fs.mkdirSync(textures, {
    recursive: !0
  }), fs.mkdirSync(sounds, {
    recursive: !0
  }), fs.mkdirSync(controller, {
    recursive: !0
  }), fs.mkdirSync(functions, {
    recursive: !0
  }), fs.mkdirSync(lang, {
    recursive: !0
  }), fs.mkdirSync(gui, {
    recursive: !0
  }), fs.writeFileSync(path.join(animations, "arm.animation.json"), autoStringify(armAnimationJson)), 
  fs.writeFileSync(path.join(animations, "arrow.animation.json"), autoStringify(arrowAnimationJson)), 
  fs.writeFileSync(path.join(animations, "carryon.animation.json"), autoStringify(carryonAnimationJson)), 
  fs.writeFileSync(path.join(animations, "extra.animation.json"), autoStringify(extraAnimationJson)), 
  fs.writeFileSync(path.join(animations, "main.animation.json"), autoStringify(mainAnimationJson)), 
  fs.writeFileSync(path.join(animations, "parcool.animation.json"), autoStringify(parcoolAnimationJson)), 
  fs.writeFileSync(path.join(animations, "swem.animation.json"), autoStringify(swemAnimationJson)), 
  fs.writeFileSync(path.join(animations, "tac.animation.json"), autoStringify(tacAnimationJson)), 
  fs.writeFileSync(path.join(animations, "slashblade.animation.json"), autoStringify(slashbladeAnimationJson)), 
  fs.writeFileSync(path.join(animations, "tlm.animation.json"), autoStringify(tlmAnimationJson)), 
  fs.writeFileSync(path.join(animations, "fp.arm.animation.json"), autoStringify(fpArmAnimationJson)), 
  fs.writeFileSync(path.join(animations, "boat.animation.json"), autoStringify(boatAnimationJson)), 
  fs.writeFileSync(path.join(controller, "main.animation_controllers.json"), autoStringify(animationControllers)), 
  fs.writeFileSync(path.join(models, "arm.json"), autoStringify(armModelJson)), fs.writeFileSync(path.join(models, "arrow.json"), autoStringify(arrowModelJson)), 
  fs.writeFileSync(path.join(models, "main.json"), autoStringify(mainModelJson)), 
  fs.writeFileSync(path.join(models, "boat.json"), autoStringify(boatModelJson)), 
  fs.writeFileSync(path.join(models, "fishing_bobber.json"), autoStringify(fishingBobberModelJson)), 
  fs.writeFileSync(path.join(models, "minecart.json"), autoStringify(minecartJson)), 
  fs.writeFileSync(path.join(lang, "en_us.json"), autoStringify(enLanguage)), fs.writeFileSync(path.join(lang, "zh_cn.json"), autoStringify(zhLanguage)), 
  fs.writeFileSync(path.join(packPath, "ysm.json"), autoStringify(ysmJson)), writePng(path.join(textures, "arrow.png"), arrowTexture), 
  writePng(path.join(textures, "boat.png"), boatTexture), writePng(path.join(textures, "fishing_bobber.png"), fishingBobberTexture), 
  writePng(path.join(textures, "minecart.png"), minecartTexture), writePng(path.join(textures, "blue.png"), blueTexture), 
  writePng(path.join(textures, "default.png"), defaultTexture), writePng(path.join(avatar, "null.png"), avatarTexture), 
  writePng(path.join(gui, "background.png"), backgroundImg), writePng(path.join(gui, "foreground.png"), foregroundImg), 
  openImportDialog(packPath);
}

function writePng(filePath, fileData) {
  let base64Data = fileData.replace(/^data:image\/png;base64,/, ""), bufferData = Buffer.from(base64Data, "base64");
  fs.writeFileSync(filePath, bufferData);
}

var createDefaultModel = new Action("ysm_utils.create_default_model", {
  name: tl("menu.ysm_utils.create_default_model"),
  icon: "fa-file-alt",
  click: async function() {
    let result = await ysmCommunityNative.dialog.showOpenDialog({
      title: tl("menu.ysm_utils.create_default_model.select_output_directory"),
      properties: [ "openDirectory" ]
    });
    if (result.canceled) return;
    let selectFilePaths = result.filePaths;
    selectFilePaths && selectFilePaths[0] && function(selectFilePaths) {
      new Dialog("create_default_model", {
        title: "menu.ysm_utils.create_default_model",
        width: 800,
        form: {
          packName: {
            label: "menu.ysm_utils.create_default_model.pack_name",
            type: "text",
            placeholder: tl("menu.ysm_utils.create_default_model.pack_name.placeholder")
          }
        },
        onConfirm: function(formResult) {
          formResult.packName && createAllFiles(selectFilePaths, formResult).catch(error => {
            console.error("YSM default model creation failed:", error), Blockbench.showMessageBox({
              title: "YSM",
              icon: "error",
              message: "Could not create the default model pack: " + error.message
            });
          });
        }
      }).show();
    }(selectFilePaths);
  }
});

const DEFAULT_ASSET_REVISION = "627eb75b020b79adb205b8f1258bb7a606850a8f", DEFAULT_ASSET_MANIFEST = [ {
  name: "armAnimationJson",
  file: "animations/arm.animation.json",
  sha256: "842feaa47347bb7fa9a53f31bf76dcf74aff618e7b52cc1637380333812a87cb"
}, {
  name: "arrowAnimationJson",
  file: "animations/arrow.animation.json",
  sha256: "01902bc329af43baf925d67eb6861c5f4e2dd5355258c96819533ed7d94239ba"
}, {
  name: "boatAnimationJson",
  file: "animations/boat.animation.json",
  sha256: "f40524137ed91be2a0e7ff6b12b73e4aa46574053e6d9f1e2e3df6da0fedb6fd"
}, {
  name: "carryonAnimationJson",
  file: "animations/carryon.animation.json",
  sha256: "fe28bda145b9a8f8acfd3aa1d85b267a55e5c6538f595161dbd2161bbebd8bda"
}, {
  name: "extraAnimationJson",
  file: "animations/extra.animation.json",
  sha256: "febebf03a70fca55ac3138c7e97fd24a0c83cdf54b27c3d3a091e8a6bb2ad1cb"
}, {
  name: "mainAnimationJson",
  file: "animations/main.animation.json",
  sha256: "1b40d032d7cecc98e03669ca0b4e86ce5767a99d90f129e54cdcd5ef71863197"
}, {
  name: "fpArmAnimationJson",
  file: "animations/fp.arm.animation.json",
  sha256: "6030836fffd11cc9883b495cc01e314c377db9f428bd0d76578f3431898a3b9a"
}, {
  name: "parcoolAnimationJson",
  file: "animations/parcool.animation.json",
  sha256: "5407ef2708e8849b9ffbeaac4dd81cbb6943a3cef53d6cd6e13f22c2426f1d98"
}, {
  name: "swemAnimationJson",
  file: "animations/swem.animation.json",
  sha256: "b0018f5a7e88c21f78b75ff18c98966428ac691c46f716950d2a8f2a0815abb3"
}, {
  name: "tacAnimationJson",
  file: "animations/tac.animation.json",
  sha256: "4594de398c4d34311d540caa2c1b314f631307fd68d810dfc84a8ac1552b3e88"
}, {
  name: "slashbladeAnimationJson",
  file: "animations/slashblade.animation.json",
  sha256: "af05ec10f7e23dd7148f6a72bdba8abd0e4899dd9e7bf6d65cc42e4feba118fb"
}, {
  name: "tlmAnimationJson",
  file: "animations/tlm.animation.json",
  sha256: "353dc14cd77017092bc969500977609c5585fe71db258cf57ae703d9cdb00641"
}, {
  name: "animationControllers",
  file: "controller/main.animation_controllers.json",
  sha256: "2954b522ea6af6ad36ddd33e45005ce816aea75cd35259be402c75440ecac72c"
}, {
  name: "enLanguage",
  file: "lang/en_us.json",
  sha256: "ec3441ecfe429f1512e3afff247622dca16dc2d64ca678a52860657b8785845f"
}, {
  name: "zhLanguage",
  file: "lang/zh_cn.json",
  sha256: "0d72ffefd89dc4950e752ad7659bb1484cac39eb7f657259776b2ae7696777c1"
}, {
  name: "armModelJson",
  file: "models/arm.json",
  sha256: "7adf7883bf15673450a139cc0b5281f421365fd55481be9a6f4c35a754bccc70"
}, {
  name: "arrowModelJson",
  file: "models/arrow.json",
  sha256: "4f04aa3cb1327346ae1f63b4f960571c990dc7fd2e0ad93965c9b130d1eff324"
}, {
  name: "boatModelJson",
  file: "models/boat.json",
  sha256: "9e4d7cf3d6c22753a52c54aef3c32b5976b03fac93e73cc6b100ad51c67f572f"
}, {
  name: "fishingBobberModelJson",
  file: "models/fishing_bobber.json",
  sha256: "9fac3cb452683c2f8164b7a118babfabb5bcc3362715e7d7352d1ff29b0cd2f1"
}, {
  name: "mainModelJson",
  file: "models/main.json",
  sha256: "50e4efc95df263b113498a7a04935873363d36c5ac0fbf9b31170f26284baa21"
}, {
  name: "minecartJson",
  file: "models/minecart.json",
  sha256: "4ee627e87958ec1235206cca85d06d3b3c473a7b2ae896a8c4fe9b95cb2fd736"
}, {
  name: "ysmJson",
  file: "ysm.json",
  sha256: "0ec49d6c1657779666f5c38c03c9f61303fe5d1bcd9e218fbb9d4d01a4f84038"
}, {
  name: "arrowTexture",
  file: "textures/arrow.png",
  sha256: "0ecda6c1557cf3571289a3212c93e125d8b075cc37ac62f14dad852d83a576ec"
}, {
  name: "boatTexture",
  file: "textures/boat.png",
  sha256: "ae83a6dff32901c63f01acf7256cbe8c36595685c3a8a6737b15d5c0ad417e14"
}, {
  name: "fishingBobberTexture",
  file: "textures/fishing_bobber.png",
  sha256: "14e65b95c519f47578b63a915744b96359d87dc9bc2822dd9ba203a228c53191"
}, {
  name: "minecartTexture",
  file: "textures/minecart.png",
  sha256: "277e32e4980b846be5dee52180a625d84b79cd01476a761005c2d0fe76be465f"
}, {
  name: "blueTexture",
  file: "textures/blue.png",
  sha256: "e8d13cbd9f432bcc58a9d954125bca35b19e9bee84151872a9643d37d2151263"
}, {
  name: "defaultTexture",
  file: "textures/default.png",
  sha256: "7145bb7042e2a47da62ca4bb9197089bacaf7a254acb4e99da261e42429f1b5f"
}, {
  name: "avatarTexture",
  file: "avatar/null.png",
  sha256: "3ded42151694f96d982098f244bf992a0d6ba6631b22d8f3e76207faf7e6d0f3"
}, {
  name: "backgroundImg",
  file: "textures/gui/background.png",
  sha256: "d13cc65035f3979c81f16763d49d8bb56e86a9d1921b2d3909def3c05b0c8d13"
}, {
  name: "foregroundImg",
  file: "textures/gui/foreground.png",
  sha256: "43d7c8b33fe33fd381e5e43791fb7e28749cae52b87f35b1c5fc19557a1e4c10"
} ];

let defaultAssetsPromise;

BBPlugin.register("ysm_utils", {
  title: "YSM Mod Plugin (Community)",
  author: packageInfo_author,
  description: packageInfo_description,
  icon: "card_membership",
  variant: "desktop",
  version: "2.5.2-community.2",
  min_version: "5.3.74",
  tags: [ "Minecraft: Java Edition", "Yes Steve Model", "Mod" ],
  await_loading: !0,
  new_repository_format: !0,
  has_changelog: !0,
  contributors: [ "TheDivisionISAC" ],
  repository: "https://github.com/TT432/blockbench-plugins",
  bug_tracker: "https://github.com/TT432/blockbench-plugins/issues",
  onload() {
    console.log("[Info] [ysm-utils-plugins] All Plugins Languages loaded."), function() {
      let cacheYsmFolders = localStorage.getItem("cacheYsmFolders");
      if (cacheYsmFolders && cacheYsmFolders.length) {
        if (cacheYsmFolders = JSON.parse(cacheYsmFolders), cacheYsmFolders) for (let name of Object.keys(cacheYsmFolders)) {
          let path = cacheYsmFolders[name];
          fs.existsSync(path) ? addCacheYsmFoldersAction(name, path) : delete cacheYsmFolders[name];
        }
        localStorage.setItem("cacheYsmFolders", JSON.stringify(cacheYsmFolders));
      }
    }(), MolangAutocomplete.DefaultContext.addNamespace(new MolangAutocomplete.Namespace({
      id: "ysm",
      shorthand: "ysm"
    }).addQuery({
      id: "dump_equipped_item",
      arguments: [ "slotType" ]
    }).addQuery({
      id: "dump_relative_block",
      arguments: [ "xOffset", "yOffset", "zOffset" ]
    }).addQuery({
      id: "dump_mods"
    }).addQuery({
      id: "dump_effects"
    }).addQuery({
      id: "dump_biome"
    }).addQuery({
      id: "mod_version",
      arguments: [ "modid" ]
    }).addQuery({
      id: "equipped_enchantment_level",
      arguments: [ "slotType", "id..." ]
    }).addQuery({
      id: "effect_level",
      arguments: [ "id..." ]
    }).addQuery({
      id: "relative_block_name",
      arguments: [ "xOffset", "yOffset", "zOffset" ]
    }).addQuery({
      id: "head_yaw"
    }).addQuery({
      id: "head_pitch"
    }).addQuery({
      id: "weather"
    }).addQuery({
      id: "dimension_name"
    }).addQuery({
      id: "fps"
    }).addQuery({
      id: "input_vertical"
    }).addQuery({
      id: "input_horizontal"
    }).addQuery({
      id: "person_view"
    }).addQuery({
      id: "is_passenger"
    }).addQuery({
      id: "is_sleep"
    }).addQuery({
      id: "is_sneak"
    }).addQuery({
      id: "biome_category"
    }).addQuery({
      id: "is_open_air"
    }).addQuery({
      id: "eye_in_water"
    }).addQuery({
      id: "frozen_ticks"
    }).addQuery({
      id: "air_supply"
    }).addQuery({
      id: "has_helmet"
    }).addQuery({
      id: "has_chest_plate"
    }).addQuery({
      id: "has_leggings"
    }).addQuery({
      id: "has_boots"
    }).addQuery({
      id: "has_mainhand"
    }).addQuery({
      id: "has_offhand"
    }).addQuery({
      id: "has_elytra"
    }).addQuery({
      id: "is_riptide"
    }).addQuery({
      id: "armor_value"
    }).addQuery({
      id: "is_close_eyes"
    }).addQuery({
      id: "rendering_in_inventory"
    }).addQuery({
      id: "rendering_in_paperdoll"
    }).addQuery({
      id: "on_ladder"
    }).addQuery({
      id: "ladder_facing"
    }).addQuery({
      id: "arrow_count"
    }).addQuery({
      id: "stinger_count"
    }).addQuery({
      id: "texture_name"
    }).addQuery({
      id: "elytra_rot_x"
    }).addQuery({
      id: "elytra_rot_y"
    }).addQuery({
      id: "elytra_rot_z"
    }).addQuery({
      id: "food_level"
    }).addQuery({
      id: "first_person_mod_hide"
    }).addQuery({
      id: "has_left_shoulder_parrot"
    }).addQuery({
      id: "has_right_shoulder_parrot"
    }).addQuery({
      id: "left_shoulder_parrot_variant"
    }).addQuery({
      id: "right_shoulder_parrot_variant"
    }).addQuery({
      id: "attack_damage"
    }).addQuery({
      id: "attack_speed"
    }).addQuery({
      id: "attack_knockback"
    }).addQuery({
      id: "movement_speed"
    }).addQuery({
      id: "knockback_resistance"
    }).addQuery({
      id: "luck"
    }).addQuery({
      id: "block_reach"
    }).addQuery({
      id: "entity_reach"
    }).addQuery({
      id: "swim_speed"
    }).addQuery({
      id: "entity_gravity"
    }).addQuery({
      id: "step_height_addition"
    }).addQuery({
      id: "nametag_distance"
    }).addQuery({
      id: "first_order",
      arguments: [ "name", "input", "response" ]
    }).addQuery({
      id: "second_order",
      arguments: [ "name", "input", "frequency", "coefficient", "response" ]
    }).addQuery({
      id: "bone_rot",
      arguments: [ "name" ]
    }).addQuery({
      id: "bone_pos",
      arguments: [ "name" ]
    }).addQuery({
      id: "bone_scale",
      arguments: [ "name" ]
    }).addQuery({
      id: "bone_pivot_abs",
      arguments: [ "name" ]
    }).addQuery({
      id: "entity_type"
    }).addQuery({
      id: "is_player"
    }).addQuery({
      id: "is_maid"
    }).addQuery({
      id: "particle",
      arguments: [ "id", "x", "y", "z", "dx", "dy", "dz", "speed", "count", "life_time" ]
    }).addQuery({
      id: "abs_particle",
      arguments: [ "id", "x", "y", "z", "dx", "dy", "dz", "speed", "count", "life_time" ]
    }).addQuery({
      id: "mainhand_charged_crossbow"
    }).addQuery({
      id: "offhand_charged_crossbow"
    }).addQuery({
      id: "is_fishing"
    }).addQuery({
      id: "perlin_noise",
      arguments: [ "seed", "x", "y", "z" ]
    }).addQuery({
      id: "on_ground_time"
    }).addQuery({
      id: "in_ground"
    }).addQuery({
      id: "projectile_owner"
    }).addQuery({
      id: "delta_movement_length"
    }).addQuery({
      id: "is_spectral_arrow"
    }).addQuery({
      id: "shoot_item_id"
    }).addQuery({
      id: "relative_block_name_any",
      arguments: [ "xOffset", "yOffset", "zOffset", "blockName..." ]
    }).addQuery({
      id: "ysm.in_shield_block_cooldown"
    }).addQuery({
      id: "ysm.xxa"
    }).addQuery({
      id: "ysm.yya"
    }).addQuery({
      id: "ysm.zza"
    }).addQuery({
      id: "ysm.play_sound",
      arguments: [ "id", "sound_name", "force_play", "volume", "pitch" ]
    }).addQuery({
      id: "ysm.stop_sound",
      arguments: [ "id" ]
    }).addQuery({
      id: "ysm.stop_all_sounds"
    }).addQuery({
      id: "ysm.block_light"
    }).addQuery({
      id: "ysm.sky_light"
    }).addQuery({
      id: "ysm.mouse",
      arguments: [ "keycode" ]
    }).addQuery({
      id: "ysm.keyboard",
      arguments: [ "keycode..." ]
    }).addQuery({
      id: "ysm.time_delta"
    }).addQuery({
      id: "ysm.sync",
      arguments: [ "int..." ]
    }).addQuery({
      id: "ysm.ground_speed2"
    }).addQuery({
      id: "ysm.throwable_item"
    }).addQuery({
      id: "ysm.hooked_in"
    }).addQuery({
      id: "ysm.is_biting"
    }).addQuery({
      id: "ysm.has_any_curios",
      arguments: [ "type", "name..." ]
    }).addQuery({
      id: "ysm.has_any_curios_with_all_tags",
      arguments: [ "type", "tag..." ]
    }).addQuery({
      id: "ysm.has_any_curios_with_any_tag",
      arguments: [ "type", "tag..." ]
    }).addQuery({
      id: "ysm.dump_curios"
    })).addNamespace(new MolangAutocomplete.Namespace({
      id: "ctrl",
      shorthand: "ctrl"
    }).addQuery({
      id: "death"
    }).addQuery({
      id: "riptide"
    }).addQuery({
      id: "sleep"
    }).addQuery({
      id: "swim"
    }).addQuery({
      id: "climb"
    }).addQuery({
      id: "climbing"
    }).addQuery({
      id: "ladder_up"
    }).addQuery({
      id: "ladder_stillness"
    }).addQuery({
      id: "ladder_down"
    }).addQuery({
      id: "fly"
    }).addQuery({
      id: "elytra_fly"
    }).addQuery({
      id: "swim_stand"
    }).addQuery({
      id: "attacked"
    }).addQuery({
      id: "jump"
    }).addQuery({
      id: "sneak"
    }).addQuery({
      id: "sneaking"
    }).addQuery({
      id: "run"
    }).addQuery({
      id: "walk"
    }).addQuery({
      id: "idle"
    }).addQuery({
      id: "hold",
      arguments: [ "slotType", "id" ]
    }).addQuery({
      id: "swing",
      arguments: [ "slotType", "id" ]
    }).addQuery({
      id: "use",
      arguments: [ "slotType", "id" ]
    }).addQuery({
      id: "armor",
      arguments: [ "slotType", "id" ]
    }).addQuery({
      id: "ride",
      arguments: [ "type", "id" ]
    }).addQuery({
      id: "carryon_type"
    }).addQuery({
      id: "carryon_is_princess"
    }).addQuery({
      id: "parcool_state"
    }).addQuery({
      id: "swem_is_ride"
    }).addQuery({
      id: "swem_state"
    }).addQuery({
      id: "tac_hold_gun"
    }).addQuery({
      id: "tac_gun_type"
    }).addQuery({
      id: "tac_gun_id"
    }).addQuery({
      id: "tac_is_fire"
    }).addQuery({
      id: "tac_is_aim"
    }).addQuery({
      id: "tac_is_reload"
    }).addQuery({
      id: "tac_is_melee"
    }).addQuery({
      id: "tac_is_draw"
    }).addQuery({
      id: "slashblade_animation"
    }).addQuery({
      id: "playing_extra_animation"
    }).addQuery({
      id: "create_hanging_skyhook"
    })).addNamespace(new MolangAutocomplete.Namespace({
      id: "tlm",
      shorthand: "tlm"
    }).addQuery({
      id: "is_begging"
    }).addQuery({
      id: "is_sitting"
    }).addQuery({
      id: "has_backpack"
    }).addQuery({
      id: "favorability_point"
    }).addQuery({
      id: "favorability_level"
    }).addQuery({
      id: "task_id"
    }).addQuery({
      id: "schedule"
    }).addQuery({
      id: "activity"
    }).addQuery({
      id: "gomoku_win_count"
    }).addQuery({
      id: "gomoku_rank"
    }).addQuery({
      id: "game_statue"
    }).addQuery({
      id: "backpack_type"
    }).addQuery({
      id: "is_entity"
    }).addQuery({
      id: "is_statue"
    }).addQuery({
      id: "is_garage_kit"
    }).addQuery({
      id: "show_item"
    })), new BarMenu("ysm_utils", [ "ysm_utils.create_default_model", "ysm_utils.direct_import", "ysm_utils.current_info_menu", CACHE_YSM_INFO_ACTION ]), 
    MenuBar.update();
  },
  onunload() {
    createDefaultModel.delete(), directImportMenuAction.delete(), currentInfoMenuAction.delete();
  },
  oninstall() {},
  onuninstall() {}
});
